import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Privacy() {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p>
                VibeRush ("the Service") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Email address, username, and other information provided during registration</li>
                <li><strong>Submitted Content:</strong> App descriptions, screenshots, URLs, prompts, and other content you voluntarily share</li>
                <li><strong>Usage Data:</strong> Access logs, IP addresses, browser information, and browsing history</li>
                <li><strong>Cookies:</strong> Used to maintain login sessions and improve the service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, operate, and improve the Service</li>
                <li>Provide customer support</li>
                <li>Send service-related notifications and updates</li>
                <li>Prevent fraud and ensure security</li>
                <li>Analyze usage patterns and create statistical data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Information Sharing</h2>
              <p>
                We do not share your personal information with third parties except in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your consent</li>
                <li>When required by law</li>
                <li>With service providers under confidentiality agreements</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your information from unauthorized access, loss, or destruction. However, no method of internet transmission is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p>You have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to your personal information</li>
                <li>Request correction or deletion of your data</li>
                <li>Object to data processing</li>
                <li>Request account deletion</li>
              </ul>
              <p>
                To exercise these rights, please contact us via the Contact page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
              <p>
                The Service is not intended for users under 13 years of age. If we become aware of data collected from children under 13, we will delete it promptly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Policy Updates</h2>
              <p>
                This Privacy Policy may be updated as needed. Significant changes will be announced on the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
              <p>
                For privacy-related inquiries, please reach out via our Contact page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
