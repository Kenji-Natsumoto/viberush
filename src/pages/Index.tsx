import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductFeed } from "@/components/ProductFeed";
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
        <ProductFeed />
      </main>
      <SubmitModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
    </div>
  );
};

export default Index;
