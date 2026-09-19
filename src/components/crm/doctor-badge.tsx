import { Stethoscope } from "lucide-react";
import { DOCTOR_TAG, isDoctorLead } from "@/lib/crm-detection";
import { cn } from "@/lib/utils";

type LeadLike = {
  name?: string | null;
  company?: string | null;
  job_title?: string | null;
  tags?: string[] | null;
};

export function isDoctorTagged(lead: LeadLike) {
  if ((lead.tags ?? []).includes(DOCTOR_TAG)) return true;
  return isDoctorLead({ name: lead.name, company: lead.company, job_title: lead.job_title });
}

/** Soft-teal "Doctor" chip shown next to doctor lead names across the CRM. */
export function DoctorBadge({ lead, className }: { lead: LeadLike; className?: string }) {
  if (!isDoctorTagged(lead)) return null;
  return (
    <span
      title="Doctor lead"
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold leading-none text-teal-600 dark:text-teal-300",
        className,
      )}
    >
      <Stethoscope className="size-3" aria-hidden />
      Doctor
    </span>
  );
}
