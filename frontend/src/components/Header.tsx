export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/ai-icon.dim_128x128.png"
              alt="AI Image Studio"
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent leading-tight">
                AI Image Studio
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">Prompt Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Build prompts for any AI image generator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
