import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";

export function LogoSection() {
  const handleLogoDownload = () => {
    const link = document.createElement("a");
    link.href = "/viberush-logo.svg";
    link.download = "viberush-logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Logo</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Light Background */}
        <div className="border border-border rounded-xl p-8 bg-white flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#8B5CF6]">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#18181B]">
              VibeRush
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">On light background</p>
        </div>

        {/* Dark Background */}
        <div className="border border-border rounded-xl p-8 bg-[#09090B] flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#8B5CF6]">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              VibeRush
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-4">On dark background</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={handleLogoDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Logo (SVG)
        </Button>
      </div>

      {/* Logo Usage Guidelines */}
      <div className="mt-10 p-6 bg-secondary rounded-xl">
        <h3 className="font-semibold text-foreground mb-4">Usage Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Maintain clear space around the logo equal to the height of the lightning bolt icon</li>
          <li>• Do not stretch, rotate, or distort the logo</li>
          <li>• Use the purple background version on both light and dark backgrounds</li>
          <li>• Minimum size: 24px height for digital use</li>
        </ul>
      </div>
    </section>
  );
}
