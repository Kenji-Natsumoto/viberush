import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ShipCTABanner } from "@/components/ShipCTABanner";
import { StatsSection } from "@/components/StatsSection";
import { HallOfProof } from "@/components/HallOfProof";
import { ProductFeed } from "@/components/ProductFeed";
import { FAQSection } from "@/components/FAQSection";
import { DirectoryCTA } from "@/components/DirectoryCTA";
import { Footer } from "@/components/Footer";
import { TrustStatement } from "@/components/TrustStatement";
import { SubmitModal } from "@/components/SubmitModal";
import { DetailsModal } from "@/components/DetailsModal";

const Index = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);

  const openSubmitModal = () => setIsSubmitModalOpen(true);
  const closeSubmitModal = () => setIsSubmitModalOpen(false);

  const handleOpenDetails = (productId: string) => {
    setDetailsProductId(productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={openSubmitModal} />
      <main>
        <HeroSection onSubmitClick={openSubmitModal} />
        <ShipCTABanner />
        <TrustStatement />
        <StatsSection />
        <HallOfProof />
        <ProductFeed />
        <FAQSection />
        <DirectoryCTA />
      </main>
      <Footer />
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={closeSubmitModal}
        onOpenDetails={handleOpenDetails}
      />
      <DetailsModal
        isOpen={!!detailsProductId}
        onClose={() => setDetailsProductId(null)}
        productId={detailsProductId}
      />
    </div>
  );
};

export default Index;
