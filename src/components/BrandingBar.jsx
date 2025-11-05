export function BrandingBar() {
  return (
    <div className="bg-brand-bg border-b border-brand-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-brand-primary font-bold">Nordic Raven Solutions 🐦‍⬛</span>
          <span className="text-brand-text-secondary">•</span>
          <span className="text-brand-text-secondary text-sm">CodePractice.AI</span>
        </div>
        <a 
          href="https://nordicravensolutions.com" 
          className="text-brand-primary hover:text-brand-primary-hover text-sm transition-colors"
        >
          ← Back to Portfolio
        </a>
      </div>
    </div>
  );
}

