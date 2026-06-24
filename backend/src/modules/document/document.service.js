const Document = require('./document.model');
const DocumentVersion = require('./documentVersion.model');
const AiAnalysis = require('../ai/aiAnalysis.model');
const Approval = require('../approval/approval.model');
const { extractTextFromPdf } = require('../../shared/utils/pdfExtractor.util');
const { generateDocumentHash } = require('../../shared/utils/hash.util');
const { analyzeDocument, compareDocuments } = require('../ai/ai.service');
const { logAction } = require('../audit/audit.service');
const { sequelize } = require('../../config/db');

exports.processNewDocument = async (title, filePath, uploaderId) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Extract text
    const extractedText = await extractTextFromPdf(filePath);
    const documentHash = generateDocumentHash(extractedText);

    // 2. Check for existing document by title or create new
    let document = await Document.findOne({ where: { title }, transaction });
    let oldVersionText = null;

    if (!document) {
      document = await Document.create({
        title,
        status: 'Draft',
        created_by_id: uploaderId,
      }, { transaction });
    } else {
      // Find old version if exists
      const oldVersion = await DocumentVersion.findOne({
        where: { document_id: document.id },
        order: [['version_number', 'DESC']],
        transaction
      });
      if (oldVersion) {
        oldVersionText = oldVersion.extracted_text;
      }
    }

    // 3. Create document version
    const versionNumber = await DocumentVersion.count({ where: { document_id: document.id }, transaction }) + 1;
    
    const documentVersion = await DocumentVersion.create({
      document_id: document.id,
      version_number: versionNumber,
      file_path: filePath,
      document_hash: documentHash,
      extracted_text: extractedText,
      uploaded_by_id: uploaderId,
    }, { transaction });

    // Update current version
    document.current_version_id = documentVersion.id;
    document.status = 'Pending HR Manager'; // Start workflow
    await document.save({ transaction });

    // 4. Check AI Analysis
    let aiAnalysis = await AiAnalysis.findOne({ where: { document_hash: documentHash }, transaction });

    if (!aiAnalysis) {
      // Call actual AI service during upload
      const aiResult = await analyzeDocument(extractedText);
      aiAnalysis = await AiAnalysis.create({
        document_version_id: documentVersion.id,
        document_hash: documentHash,
        summary: aiResult.data.summary,
        key_points: aiResult.data.key_points,
        risk_points: aiResult.data.risk_points,
        missing_information: aiResult.data.missing_information,
        important_changes: aiResult.data.important_changes,
        hr_analysis: aiResult.data.hr_analysis,
        ops_analysis: aiResult.data.ops_analysis,
        director_analysis: aiResult.data.director_analysis,
        added_content: null,
        removed_content: null,
        modified_content: null,
        policy_impact: "Not analyzed",
        risk_impact: "Not analyzed",
        provider: aiResult.provider,
      }, { transaction });
    } else {
      // Ensure the old analysis links to this new version if reused, and bypass unique hash constraints
      aiAnalysis = await AiAnalysis.create({
        document_version_id: documentVersion.id,
        document_hash: documentHash + '-' + Date.now(),
        summary: aiAnalysis.summary,
        key_points: aiAnalysis.key_points,
        risk_points: aiAnalysis.risk_points,
        missing_information: aiAnalysis.missing_information,
        important_changes: aiAnalysis.important_changes,
        hr_analysis: aiAnalysis.hr_analysis,
        ops_analysis: aiAnalysis.ops_analysis,
        director_analysis: aiAnalysis.director_analysis,
        added_content: aiAnalysis.added_content,
        removed_content: aiAnalysis.removed_content,
        modified_content: aiAnalysis.modified_content,
        policy_impact: aiAnalysis.policy_impact,
        risk_impact: aiAnalysis.risk_impact,
        provider: aiAnalysis.provider,
      }, { transaction });
    }

    // 5. Start approval workflow (HR Manager -> Ops -> Director)
    // Create initial pending approval for HR Manager
    const hrManagers = await sequelize.models.User.findAll({ where: { role: 'HR Manager' }, transaction });
    if (hrManagers.length > 0) {
      await Approval.create({
        document_id: document.id,
        document_version_id: documentVersion.id,
        approver_id: hrManagers[0].id, // Assign to first HR Manager found for simplicity
        role: 'HR Manager',
        status: 'Pending',
        step: 1
      }, { transaction });
    }

    await logAction(uploaderId, 'UPLOAD_DOCUMENT', 'Document', document.id, { version: versionNumber });

    await transaction.commit();

    return {
      document,
      version: documentVersion,
      analysis: aiAnalysis
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getDocumentById = async (id) => {
  return await Document.findByPk(id, {
    include: [
      {
        model: DocumentVersion,
        as: 'versions',
        include: [
          { model: AiAnalysis, as: 'ai_analysis' }
        ]
      },
      {
        model: Approval,
        as: 'approvals'
      }
    ],
    order: [
      [{ model: DocumentVersion, as: 'versions' }, 'version_number', 'DESC']
    ]
  });
};

exports.getAllDocuments = async () => {
  const documents = await Document.findAll({
    include: [
      {
        model: sequelize.models.User,
        as: 'creator',
        attributes: ['id', 'name']
      },
      {
        model: DocumentVersion,
        as: 'versions',
        attributes: ['version_number'],
      },
      {
        model: Approval,
        as: 'approvals'
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return documents.map(doc => {
    // Determine the highest version number
    let currentVersion = 'v1.0';
    if (doc.versions && doc.versions.length > 0) {
      const highestVersion = Math.max(...doc.versions.map(v => v.version_number));
      currentVersion = `v${highestVersion}.0`;
    }

    return {
      id: doc.id,
      title: doc.title,
      category: 'General', // Defaulting as category isn't in Document model yet
      version: currentVersion,
      status: doc.status,
      uploader: doc.creator ? doc.creator.name : 'Unknown',
      date: new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approvals: doc.approvals || []
    };
  });
};
exports.analyzeDocumentManually = async (documentId) => {
  const transaction = await sequelize.transaction();
  try {
    const document = await Document.findByPk(documentId, {
      include: [{ model: DocumentVersion, as: 'versions', order: [['version_number', 'DESC']], limit: 1 }],
      transaction
    });

    if (!document || !document.versions || document.versions.length === 0) {
      throw new Error('Document or version not found');
    }

    const latestVersion = document.versions[0];
    const documentHash = latestVersion.document_hash;
    const extractedText = latestVersion.extracted_text;

    // Call actual AI service
    const aiResult = await analyzeDocument(extractedText);

    // Find the existing AiAnalysis and update it
    let aiAnalysis = await AiAnalysis.findOne({ where: { document_version_id: latestVersion.id }, transaction });

    if (aiAnalysis) {
      await aiAnalysis.update({
        summary: aiResult.data.summary,
        key_points: aiResult.data.key_points,
        risk_points: aiResult.data.risk_points,
        missing_information: aiResult.data.missing_information,
        important_changes: aiResult.data.important_changes,
        hr_analysis: aiResult.data.hr_analysis,
        ops_analysis: aiResult.data.ops_analysis,
        director_analysis: aiResult.data.director_analysis,
        provider: aiResult.provider,
      }, { transaction });
    } else {
      aiAnalysis = await AiAnalysis.create({
        document_version_id: latestVersion.id,
        document_hash: documentHash,
        summary: aiResult.data.summary,
        key_points: aiResult.data.key_points,
        risk_points: aiResult.data.risk_points,
        missing_information: aiResult.data.missing_information,
        important_changes: aiResult.data.important_changes,
        hr_analysis: aiResult.data.hr_analysis,
        ops_analysis: aiResult.data.ops_analysis,
        director_analysis: aiResult.data.director_analysis,
        provider: aiResult.provider,
      }, { transaction });
    }

    await transaction.commit();
    return aiAnalysis;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
