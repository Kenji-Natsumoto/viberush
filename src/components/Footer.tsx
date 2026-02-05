import { Link } from "react-router-dom";
import { Zap, Heart, Download } from "lucide-react";

export function Footer() {
  const handleLogoDownload = () => {
    const link = document.createElement('a');
    link.href = '/viberush-logo.svg';
    link.download = 'viberush-logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                VibeRush
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Unleash the world's creativity through the speed of thought. The platform for discovering and sharing AI-native apps.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> by Vibe Coders
            </p>
            <button
              onClick={handleLogoDownload}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-2"
            >
              <Download className="h-3 w-3" />
              Download Logo (SVG)
            </button>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://forms.gle/xDHYJWqsXEpYbpmD6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} VibeRush Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
