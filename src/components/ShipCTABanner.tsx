import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: "🌍",
    label: "Get discovered",
    desc: "Your product in front of makers, early adopters & the global Vibe Coding community — live today.",
  },
  {
    icon: "🎯",
    label: "Reach real users",
    desc: "People who are actively looking for AI-built tools — your next fans are here.",
  },
  {
    icon: "🤝",
    label: "Get noticed by investors & supporters",
    desc: "We actively connect standout makers with VCs, technical collaborators & press. SHIPping today is your first step.",
  },
];

export function ShipCTABanner() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 md:px-6 pb-6">
      <div
        className="relative max-w-5xl mx-auto rounded-2xl px-6 py-6 md:py-8 md:px-8 flex flex-col gap-6"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        {/* Free badge */}
        <span className="absolute top-3 left-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#FF6B35] text-white">
          ✦ Free to ship
        </span>

        {/* Top — message + CTA */}
        <div className="mt-5 md:mt-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Built something with AI?
            </h2>
            <p className="text-[13px] text-gray-300 mt-1">
              Ship it in 30 seconds — no gatekeeping, no engineers required
            </p>
          </div>

          <button
            onClick={() => navigate("/ship-guide")}
            className="w-full md:w-auto h-11 px-6 rounded-full bg-white text-[#1a1a2e] font-semibold text-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-lg shrink-0 cursor-pointer"
          >
            🚀 Ship Your Product
          </button>
        </div>

        {/* Bottom — benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-5">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-start gap-2">
              <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{b.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
