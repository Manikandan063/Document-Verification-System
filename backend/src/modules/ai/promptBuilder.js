exports.buildAnalysisPrompt = (extractedText) => {
  return `
    Analyze the following document and provide the analysis in JSON format ONLY. 
    Do not use markdown blocks like \`\`\`json. Just return raw JSON.
    
    Expected JSON schema:
    {
      "summary": "String: A common summary of the document",
      "key_points": ["Array of Strings: Key points"],
      "risk_points": ["Array of Strings: Risk points or concerns"],
      "missing_information": ["Array of Strings: Missing information that should be present"],
      "important_changes": ["Array of Strings: Any important changes or highlights"],
      "hr_analysis": {
        "risks": ["HR Risks"],
        "compliance_issues": ["HR Compliance Issues"],
        "missing_info": ["Missing HR Information"],
        "checklist": ["HR Review Checklist"],
        "suggestions": ["HR Suggestions"]
      },
      "ops_analysis": {
        "risks": ["Operational Risks"],
        "resource_impact": ["Resource Impact"],
        "business_continuity": ["Business Continuity"],
        "checklist": ["Operations Checklist"],
        "suggestions": ["Operations Suggestions"]
      },
      "director_analysis": {
        "business_impact": ["Business Impact"],
        "financial_impact": ["Financial Impact"],
        "strategic_risks": ["Strategic Risks"],
        "checklist": ["Director Checklist"],
        "suggestions": ["Final Decision Suggestions"]
      }
    }

    Document Text:
    ${extractedText}
  `;
};

exports.buildComparisonPrompt = (oldText, newText) => {
  return `
    Compare the following two versions of a document (Old and New) and provide the analysis in JSON format ONLY.
    Do not use markdown blocks like \`\`\`json. Just return raw JSON.

    Expected JSON schema:
    {
      "added_content": ["Array of Strings: Content added in the new version"],
      "removed_content": ["Array of Strings: Content removed from the old version"],
      "modified_content": ["Array of Strings: Content that was modified"],
      "policy_impact": "String: Impact on existing policies",
      "risk_impact": "String: Impact on risks"
    }

    Old Document Text:
    ${oldText}

    New Document Text:
    ${newText}
  `;
};
