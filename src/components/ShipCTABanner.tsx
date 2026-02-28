import { useNavigate } from "react-router-dom";

export function ShipCTABanner() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 md:px-6 pb-6">
      <div
        className="relative max-w-5xl mx-auto rounded-2xl px-6 py-5 md:py-5 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        {/* Free badge */}
        <span className="absolute top-3 left-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#FF6B35] text-white">
          ✦ Free to ship
        </span>

        {/* Left — message */}
        <div className="mt-5 md:mt-0">
          <h2 className="text-lg font-bold text-white">
            Built something with AI?
          </h2>
          <p className="text-[13px] text-gray-300 mt-1">
            Ship it in 30 seconds — no gatekeeping, no engineers required
          </p>
        </div>

        {/* Right — CTA */}
        <button
          onClick={() => navigate("/ship-guide")}
          className="w-full md:w-auto h-11 px-6 rounded-full bg-white text-[#1a1a2e] font-semibold text-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-lg shrink-0 cursor-pointer"
        >
          🚀 Ship Your Product
        </button>
      </div>
    </section>
  );
}
