import { useNavigate, useLocation } from "react-router-dom";

const HIDDEN_PATHS = ["/ship-guide", "/admin", "/more-detail"];

export function FloatingShipButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <button
      onClick={() => navigate("/ship-guide")}
      className="fixed bottom-5 right-5 z-50 h-10 md:h-11 px-4 md:px-5 rounded-full bg-[#FF6B35] text-white font-semibold text-sm shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      🚀 Ship it
    </button>
  );
}
