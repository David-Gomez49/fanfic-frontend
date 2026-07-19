"use client";
import Link from "next/link";
import { useState } from "react";
import { GitBranch, Mail, MessageSquare } from "lucide-react";
import { AdminFooterLink } from "@/shared/components/common/admin-footer-link";
import { FeedbackDialog } from "@/shared/components/common/feedback-dialog";

const links = [
  { label: "Browse", href: "/browse" },
  { label: "Add a fic", href: "/add" },
  { label: "Profile", href: "/profile" },
];

export function SiteFooter() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="font-display text-lg tracking-tight">Ficshelf</Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
              Social fanfiction catalog. Discover, tag, rate and share
              your favorite reads with the community.
            </p>
          </div>

          {/* Nav + Developer: 2 cols on mobile, 2 cols on desktop */}
          <div className="col-span-1 sm:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              {/* Links */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Navigate</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-foreground/70 hover:text-primary-glow transition">{l.label}</Link>
                    </li>
                  ))}
                  <AdminFooterLink />
                </ul>
              </div>

              {/* Developer */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Developer</h4>
                <p className="text-sm text-foreground/70 mb-3">David Gomez</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-glow transition text-left"
                  >
                    <MessageSquare className="h-4 w-4" /> Send feedback
                  </button>
                  <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-glow transition">
                    <GitBranch className="h-4 w-4" /> github.com/tuusuario
                  </a>
                  <a href="mailto:tu@email.com"
                     className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-glow transition">
                    <Mail className="h-4 w-4" /> tu@email.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground" />
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </footer>
  );
}
