export type DocumentRecord = {
  name: string;
  relativePath: string;
  title: string;
};

const DOCUMENTS: Record<string, DocumentRecord> = {
  get_start_here: {
    name: "get_start_here",
    relativePath: "README.md",
    title: "Start Here",
  },
  get_operating_model: {
    name: "get_operating_model",
    relativePath: "its_operating_model.md",
    title: "ITS Operating Model",
  },
  get_work_management_model: {
    name: "get_work_management_model",
    relativePath: "its_work_management_model.md",
    title: "ITS Work Management Model",
  },
  get_work_delivery_framework: {
    name: "get_work_delivery_framework",
    relativePath: "work_delivery/work_delivery_framework.md",
    title: "Work Delivery Framework",
  },
  get_deliverable_specifications_index: {
    name: "get_deliverable_specifications_index",
    relativePath: "work_delivery/deliverable_specifications_index.md",
    title: "Deliverable Specifications Index",
  },
  get_standard_deliverables_guide: {
    name: "get_standard_deliverables_guide",
    relativePath: "work_delivery/standard_deliverables_guide.md",
    title: "Standard Deliverables Guide",
  },
};

const STAGE_GUIDANCE: Array<{ match: RegExp; doc: DocumentRecord }> = [
  {
    match: /\bstage 1\b|\bassess|\bassessment\b/i,
    doc: {
      name: "work_assessment_process",
      relativePath: "work_delivery/work_assessment/work_assessment_process.md",
      title: "Work Assessment Process",
    },
  },
  {
    match: /\bsmall governed work\b|\bwork brief\b/i,
    doc: {
      name: "work_brief_specification",
      relativePath: "work_delivery/work_brief/work_brief_specification.md",
      title: "Work Brief Specification",
    },
  },
  {
    match: /\binitiative\b|\bformal baseline\b/i,
    doc: {
      name: "initiative_definition_document_specification",
      relativePath:
        "work_delivery/governance_and_control_deliverables/initiative_definition_document_specification.md",
      title: "Initiative Definition Document Specification",
    },
  },
];

export function getDocumentByName(name: string): DocumentRecord | undefined {
  return DOCUMENTS[name];
}

export function getStageGuidance(stageOrIntent: string): DocumentRecord | undefined {
  return STAGE_GUIDANCE.find(({ match }) => match.test(stageOrIntent))?.doc;
}
