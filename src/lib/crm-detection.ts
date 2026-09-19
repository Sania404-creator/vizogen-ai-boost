/** Shared doctor-lead detection, safe to import from server and browser code. */
export const DOCTOR_TAG = "Doctor";

/** Case-insensitive "Dr", "Dr.", "DR ", "Doctor" detector with word boundaries. */
export const DOCTOR_PATTERN = /(^|[^a-z0-9])(dr|drs|doctor)([^a-z0-9]|$)/i;

export function isDoctorLead(input: {
  name?: string | null;
  company?: string | null;
  job_title?: string | null;
}) {
  const haystack = [input.name, input.company, input.job_title].filter(Boolean).join(" ");
  return DOCTOR_PATTERN.test(haystack);
}
