import { Mail } from 'lucide-react';

const subject = encodeURIComponent('Request Removal – VibeRush');
const body = encodeURIComponent(
  `Hello,\nI would like to request removal of my profile and any associated content from VibeRush.\nProfile URL (if known):\nName (optional):\nThank you.`
);
const mailtoHref = `mailto:kn@sprintjapan.net?subject=${subject}&body=${body}`;

export function TrustStatement() {
  return (
    <section className="py-6 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="rounded-xl border border-border bg-secondary/30 backdrop-blur-sm px-6 py-5 text-center">
          <h3 className="text-sm font-semibold text-foreground tracking-wide">
            Creators own their identity.
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            We'll remove any profile immediately upon request — no questions asked.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Unclaimed profiles are treated as previews.
          </p>
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
          >
            <Mail className="h-3 w-3" />
            Request removal
          </a>
        </div>
      </div>
    </section>
  );
}
