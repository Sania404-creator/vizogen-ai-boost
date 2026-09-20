import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createLead,
  isDoctorLead,
  LEAD_SOURCE_LABELS,
  MANUAL_LEAD_SOURCES,
  type Lead,
} from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeamMember = { user_id: string; full_name: string; email: string };

export function AddLeadDialog({ team }: { team: TeamMember[] }) {
  const queryClient = useQueryClient();
  const add = useServerFn(createLead);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    source: "manual" as (typeof MANUAL_LEAD_SOURCES)[number],
    assignedTo: "",
    followUpOn: "",
    tags: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);

  const looksLikeDoctor = isDoctorLead({ name: form.name, company: form.company });

  const submit = async () => {
    setBusy(true);
    try {
      const lead = (await add({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          jobTitle: form.jobTitle,
          source: form.source,
          status: "new",
          assignedTo: form.assignedTo,
          followUpOn: form.followUpOn,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          message: form.message,
        },
      })) as Lead;
      const tagged = (lead?.tags ?? []).includes("Doctor");
      toast.success("Lead added", {
        ...(tagged ? { description: "— tagged as Doctor Lead" } : {}),
      });
      setOpen(false);
      setForm({ ...form, name: "", email: "", phone: "", company: "", message: "", tags: "" });
      void queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-doctor-leads"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-doctor-lead-count"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-lead-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-doctor-lead-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["crm-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the lead.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-brand text-white">
          <Plus className="size-4" /> Add lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a lead</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Full name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Business / clinic name (optional)</Label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone number</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Job title</Label>
            <Input
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Lead source</Label>
            <Select
              value={form.source}
              onValueChange={(v) => setForm({ ...form, source: v as typeof form.source })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MANUAL_LEAD_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {LEAD_SOURCE_LABELS[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Assign to</Label>
            <Select
              value={form.assignedTo || "me"}
              onValueChange={(v) => setForm({ ...form, assignedTo: v === "me" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me">Me</SelectItem>
                {team.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.full_name || m.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Follow-up date</Label>
            <Input
              type="date"
              value={form.followUpOn}
              onChange={(e) => setForm({ ...form, followUpOn: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes (optional)</Label>
            <Textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          {looksLikeDoctor ? (
            <p className="text-xs text-primary sm:col-span-2">
              This lead will be tagged as a Doctor Lead automatically.
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={busy || form.name.trim().length < 2}
            className="gradient-brand text-white"
          >
            Save lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
