import { useState, useEffect } from "react";
import { Radio } from "lucide-react";

export function LiveIndicator() {
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    // Generate initial random count between 3-8
    const initialCount = Math.floor(Math.random() * 6) + 3;
    setViewerCount(initialCount);

    // Simulate fluctuation every 5-10 seconds
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const newCount = prev + change;
        return Math.max(3, Math.min(8, newCount)); // Keep between 3-8
      });
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <Radio className="h-3.5 w-3.5 text-green-500" />
      <span className="text-green-600 dark:text-green-400 font-medium">
        <span className="tabular-nums">{viewerCount}</span> vibing now
      </span>
    </div>
  );
}
