import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LogoSection } from "@/components/brand/LogoSection";
import { ColorPaletteSection } from "@/components/brand/ColorPaletteSection";
import { TypographySection } from "@/components/brand/TypographySection";
import { FeaturedMakersGuide } from "@/components/brand/FeaturedMakersGuide";
import { ProductPageTemplate } from "@/components/brand/ProductPageTemplate";

const Brand = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Brand Guidelines
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resources and guidelines for using the VibeRush brand identity
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-16 p-6 bg-secondary rounded-xl">
          <h2 className="font-semibold text-foreground mb-4">Contents</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            <li>
              <a href="#logo" className="text-muted-foreground hover:text-foreground transition-colors">
                1. Logo
              </a>
            </li>
            <li>
              <a href="#colors" className="text-muted-foreground hover:text-foreground transition-colors">
                2. Color Palette
              </a>
            </li>
            <li>
              <a href="#typography" className="text-muted-foreground hover:text-foreground transition-colors">
                3. Typography
              </a>
            </li>
            <li>
              <a href="#featured-makers" className="text-muted-foreground hover:text-foreground transition-colors">
                4. Featured Makers Section
              </a>
            </li>
            <li>
              <a href="#product-page" className="text-muted-foreground hover:text-foreground transition-colors">
                5. Product Detail Page
              </a>
            </li>
          </ul>
        </nav>

        {/* Sections */}
        <div id="logo">
          <LogoSection />
        </div>
        
        <div id="colors">
          <ColorPaletteSection />
        </div>
        
        <div id="typography">
          <TypographySection />
        </div>
        
        <div id="featured-makers">
          <FeaturedMakersGuide />
        </div>
        
        <div id="product-page">
          <ProductPageTemplate />
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Brand;
