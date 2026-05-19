import {
  leadSchema,
  normalizeLeadInput,
} from "../../../../../shared/validation/lead.schema.js";

export const buildNestedLeadErrors = (issues = []) =>
  issues.reduce((acc, issue) => {
    const [section, field] = issue.path;

    if (!section || !field || acc[section]?.[field]) {
      return acc;
    }

    return {
      ...acc,
      [section]: {
        ...acc[section],
        [field]: issue.message,
      },
    };
  }, {});

export const validateLeadForm = (form) => {
  const result = leadSchema.safeParse(normalizeLeadInput(form));

  if (result.success) {
    return {};
  }

  return buildNestedLeadErrors(result.error.issues);
};

export const hasTouchedLeadFields = (touchedState) =>
  Object.values(touchedState).some((section) =>
    Object.values(section ?? {}).some(Boolean),
  );
