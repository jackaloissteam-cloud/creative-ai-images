export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "ai-image-studio"
  );

  return (
    <footer className="border-t border-border bg-card/50 mt-8">
      <div className="container mx-auto px-4 max-w-7xl py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} AI Image Studio. All rights reserved.</span>
          <span>
            Built with{" "}
            <span className="text-primary">♥</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
