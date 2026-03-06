"use client";

export default function MobileFallback() {
  return (
    <div className="fixed inset-0 bg-[#0a0a1a] flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🌍</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Geopolitics.fyi
        </h1>
        <p className="text-gray-400 mb-6">
          This interactive 3D globe experience is optimized for desktop browsers
          with WebGL support.
        </p>
        <p className="text-amber-500 text-sm">
          Please visit on a desktop or laptop for the full experience.
        </p>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-xs">
            How conflict moves capital
          </p>
        </div>
      </div>
    </div>
  );
}
