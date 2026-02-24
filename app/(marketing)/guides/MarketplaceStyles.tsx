"use client";

export default function MarketplaceStyles() {
  return (
    <style jsx global>{`
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 12s linear infinite;
      }
      @keyframes shimmer {
        0% { background-position: 0 0; }
        100% { background-position: 60px 0; }
      }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}