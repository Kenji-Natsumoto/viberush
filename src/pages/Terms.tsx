import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                VibeRush ("the Service") is a community platform for sharing and discovering applications built with AI. By using this Service, you agree to be bound by these Terms of Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. User Content</h2>
              <p>
                All content you submit (app information, screenshots, descriptions, prompts, etc.) remains your intellectual property. However, by submitting content, you grant the Service a non-exclusive license to display and share your content on the platform.
              </p>
              <p>The following content is prohibited:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Illegal content or content that promotes illegal activities</li>
                <li>Content that infringes on copyrights, trademarks, or other intellectual property rights</li>
                <li>Defamatory, discriminatory, or hateful content</li>
                <li>Malware, spam, or phishing-related content</li>
                <li>Pornographic or adult content</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
              <p>
                Users are fully responsible for the content they submit. The Service assumes no liability for damages caused by submitted apps or linked services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Account Management</h2>
              <p>
                Users are responsible for maintaining the security of their account information. Please report any unauthorized use immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Service Modifications</h2>
              <p>
                The Service may modify, suspend, or terminate its services at any time without prior notice. We are not liable for any damages resulting from such changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Disclaimer</h2>
              <p>
                The Service is provided "as is." We are not liable for any direct or indirect damages resulting from the use of this Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
              <p>
                These terms may be updated without notice. Continued use of the Service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
              <p>
                For questions about these terms, please reach out via our Contact page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
