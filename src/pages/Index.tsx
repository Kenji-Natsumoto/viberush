import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { FeaturedBuilders } from "@/components/FeaturedBuilders";
import { ProductFeed } from "@/components/ProductFeed";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { SubmitModal } from "@/components/SubmitModal";

const Index = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const openSubmitModal = () => setIsSubmitModalOpen(true);
  const closeSubmitModal = () => setIsSubmitModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={openSubmitModal} />
      <main>
        <HeroSection onSubmitClick={openSubmitModal} />
        <StatsSection />
        <FeaturedBuilders />
        <ProductFeed />
        <FAQSection />
      </main>
      <Footer />
      <SubmitModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
    </div>
  );
};

export default Index;
