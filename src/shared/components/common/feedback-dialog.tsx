"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { toast } from "sonner";

type FeedbackType = "report" | "suggestion" | "bug" | "other";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: FeedbackType;
  ficId?: string;
  ficTitle?: string;
  requiresAuth?: boolean;
  isAuthenticated?: boolean;
}

const TYPE_OPTIONS: { value: FeedbackType; label: string }[] = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug" },
  { value: "other", label: "Other" },
];

const REPORT_REASONS = [
  "Plagiarism",
  "Inappropriate content",
  "Wrong metadata",
  "Broken link",
  "Other",
];

export function FeedbackDialog({ open, onOpenChange, defaultType, ficId, ficTitle, requiresAuth, isAuthenticated }: FeedbackDialogProps) {
  const [type, setType] = useState<FeedbackType>(defaultType || "suggestion");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const isReport = type === "report";

  const submit = useMutation({
    mutationFn: (data: { type: string; subject?: string; text: string; ficId?: string }) =>
      api.post("/api/feedback", data),
    onSuccess: () => {
      toast.success(isReport ? "Report submitted" : "Feedback sent. Thanks!");
      onOpenChange(false);
      setSubject("");
      setText("");
    },
    onError: (e: any) => toast.error(e.message || "Failed to send feedback"),
  });

  const handleSubmit = () => {
    if (!text.trim()) return;
    if (requiresAuth && !isAuthenticated) {
      toast.error("You must be signed in to report");
      return;
    }
    submit.mutate({
      type,
      subject: subject.trim() || undefined,
      text: text.trim(),
      ...(ficId ? { ficId } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReport ? "Report fanfic" : "Send feedback"}</DialogTitle>
          <DialogDescription>
            {isReport
              ? `Report issues with "${ficTitle || 'this fanfic'}".`
              : "Help us improve Ficshelf with your suggestions or report issues."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {!defaultType && (
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {isReport && (
            <div className="space-y-2">
              <Label htmlFor="fd-subject">Reason</Label>
              <select
                id="fd-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground"
              >
                <option value="">Select a reason…</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {!isReport && (
            <div className="space-y-2">
              <Label htmlFor="fd-subject">Subject (optional)</Label>
              <Input
                id="fd-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief title…"
                className="bg-surface border-border"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fd-text">{isReport ? "Details" : "Message"}</Label>
            <Textarea
              id="fd-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isReport ? "Describe the issue in detail…" : "Share your thoughts…"}
              className="bg-surface border-border min-h-[120px] resize-none"
              maxLength={2000}
            />
            <span className="text-xs text-muted-foreground">{text.length}/2000</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              className="bg-gradient-primary"
              disabled={!text.trim() || submit.isPending || (isReport && !subject)}
              onClick={handleSubmit}
            >
              {submit.isPending ? "Sending…" : isReport ? "Submit report" : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
