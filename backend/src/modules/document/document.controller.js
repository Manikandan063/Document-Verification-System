const documentService = require('./document.service');
const { successResponse, errorResponse } = require('../../shared/utils/response.util');
const { uploadDocumentSchema } = require('./document.validation');

exports.uploadDocument = async (req, res, next) => {
  try {
    const { title } = uploadDocumentSchema.parse({ body: req.body }).body;
    
    if (!req.file) {
      return errorResponse(res, 400, 'PDF file is required');
    }

    const result = await documentService.processNewDocument(
      title,
      req.file.path,
      req.user.id
    );

    return successResponse(res, 201, 'Document uploaded and analyzed successfully', result);
  } catch (error) {
    next(error);
  }
};

exports.getDocumentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await documentService.getDocumentById(id);
    if (!document) {
      return errorResponse(res, 404, 'Document not found');
    }
    return successResponse(res, 200, 'Document details fetched successfully', document);
  } catch (error) {
    next(error);
  }
};

exports.getAllDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getAllDocuments();
    // Return just the array directly since the frontend expects res.data to be an array:
    // `api.get('/documents').then(res => setDocuments(res.data))`
    // But since `api` expects standard structure, if frontend is using res.data, wait:
    // If backend uses successResponse, it returns { success: true, message: ..., data: [...] }
    // If frontend does `api.get().then(res => setDocuments(res.data))`, it will set `documents` to `{ success: true, ... }` which breaks the array map.
    // Actually, looking at the frontend code: `api.get('/documents').then(res => setDocuments(res.data))`
    // Usually res.data is the axios response payload. If the backend sends `{ success: true, data: [...] }`, then `res.data` is that object.
    // Let's send the array directly or extract it in frontend. 
    // Wait, the frontend code literally says: `api.get('/documents').then(res => setDocuments(res.data.data || res.data))` is safer.
    // But let's just use successResponse for consistency.
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

exports.analyzeDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aiAnalysis = await documentService.analyzeDocumentManually(id);
    return successResponse(res, 200, 'Document analyzed successfully', aiAnalysis);
  } catch (error) {
    next(error);
  }
};
