import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { CrmShell } from "@/components/crm/shell";
import { getCrmSession, inviteMember, listTeam, updateMember } from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export const Route = createFileRoute("/_crm/crm/team")({
  head: () => ({
    meta: [
      { title: "Team — Vizogen CRM" },
      {
        name: "description",
        content: "Add sales reps, set roles and control which leads each member can see.",
      },
      { property: "og:title", content: "Team — Vizogen CRM" },
      { property: "og:description", content: "Manage CRM members, roles and lead visibility." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const queryClient = useQueryClient();
  const fetchSession = useServerFn(getCrmSession);
  const fetchTeam = useServerFn(listTeam);
  const patch = useServerFn(updateMember);

  const session = useQuery({ queryKey: ["crm-session"], queryFn: () => fetchSession() });
  const team = useQuery({ queryKey: ["crm-team"], queryFn: () => fetchTeam() });
  const isAdmin = session.data?.isAdmin ?? false;

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["crm-team"] });

  const update = async (input: Parameters<typeof patch>[0]["data"]) => {
    try {
      await patch({ data: input });
      refresh();
      toast.success("Team member updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  return (
    <CrmShell
      title="Team"
      subtitle="Roles and lead visibility for your sales team"
      actions={isAdmin ? <InviteDialog onDone={refresh} /> : undefined}
    >
      {!isAdmin ? (
        <div className="mb-5 rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          Only Admins can add members or change roles. You can view the team below.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {(team.data ?? []).map((m) => (
          <div key={m.user_id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{m.full_name || m.email}</p>
                <p className="truncate text-sm text-muted-foreground">{m.email}</p>
              </div>
              <Badge variant={m.role === "admin" ? "default" : "secondary"} className="gap-1">
                {m.role === "admin" ? <ShieldCheck className="size-3" /> : null}
                {m.role === "admin" ? "Admin" : "Sales rep"}
              </Badge>
            </div>

            {isAdmin ? (
              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select
                    value={m.role}
                    onValueChange={(v) =>
                      update({ userId: m.user_id, role: v as "admin" | "sales_rep" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin — full access</SelectItem>
                      <SelectItem value="sales_rep">Sales rep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Can see all leads</span>
                  <Switch
                    checked={m.can_view_all}
                    onCheckedChange={(v) => update({ userId: m.user_id, canViewAll: v })}
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Active</span>
                  <Switch
                    checked={m.active}
                    onCheckedChange={(v) => update({ userId: m.user_id, active: v })}
                  />
                </label>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {m.can_view_all ? "Sees all leads" : "Sees only assigned leads"}
              </p>
            )}
          </div>
        ))}
      </div>
    </CrmShell>
  );
}

function InviteDialog({ onDone }: { onDone: () => void }) {
  const invite = useServerFn(inviteMember);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "sales_rep">("sales_rep");
  const [canViewAll, setCanViewAll] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await invite({ data: { fullName, email, password, role, canViewAll } });
      toast.success(`Login details emailed to ${email}.`);
      setOpen(false);
      setFullName("");
      setEmail("");
      setPassword("");
      onDone();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the member.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gradient-brand text-white">
          <UserPlus className="size-4" /> Add member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a team member</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Work email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Temporary password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_rep">Sales rep</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Can see all leads</span>
            <Switch checked={canViewAll} onCheckedChange={setCanViewAll} />
          </label>
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={busy || fullName.length < 2 || !email || password.length < 8}
            className="gradient-brand text-white"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null} Send login details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
