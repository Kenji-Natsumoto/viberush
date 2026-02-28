import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PostShipOverlayProps {
  productId: string;
  onComplete: () => void;
}

export function PostShipOverlay({ productId, onComplete }: PostShipOverlayProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"success" | "choice">("success");

  useEffect(() => {
    const timer = setTimeout(() => setStep("choice"), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(26, 26, 46, 0.95)" }}>
        <div className="text-center animate-fade-in">
          <div className="text-7xl mb-6 animate-bounce">🔥</div>
          <h2 className="text-[32px] font-bold text-white mb-3">Shipped! 🔥</h2>
          <p className="text-gray-300 text-base">Your product is now LIVE on VibeRush.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(26, 26, 46, 0.95)" }}>
      <div className="w-full max-w-sm mx-4 rounded-2xl border border-border bg-card p-6 space-y-5 animate-scale-in">
        <h3 className="text-xl font-bold text-foreground text-center">What's next?</h3>

        <button
          onClick={() => {
            onComplete();
            navigate(`/product/${productId}`);
          }}
          className="w-full h-12 rounded-full bg-[#FF6B35] text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        >
          👁 View Your Product Page
        </button>

        <button
          onClick={() => {
            onComplete();
            navigate("/dashboard");
          }}
          className="w-full h-12 rounded-full bg-background border border-border text-foreground font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        >
          ⚙️ Add More Details
        </button>

        <p className="text-xs text-muted-foreground text-center">
          You can always edit your product later from Dashboard → Edit App
        </p>
      </div>
    </div>
  );
}
