import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ImageGenerationForm from "./components/ImageGenerationForm";
import ImageDisplay from "./components/ImageDisplay";
import PromptHistory from "./components/PromptHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

export interface OnGeneratePayload {
  prompt: string;
  criteria: {
    bodyType: string;
    age: number;
    ethnicity: string;
    artStyle: string;
    height: number;
    weight: number;
    negativePrompt: string;
    aspectRatio: string;
    cameraLens: string;
    clothing: string;
    situationPose: string;
    situationFiguration: string;
    situationBehavior: string;
    situationPosing: string;
    cameraAngle: string;
    lighting: string;
    environment: string;
    composition: string;
  };
}

function AppContent() {
  const [lastPayload, setLastPayload] = useState<OnGeneratePayload | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (payload: OnGeneratePayload) => {
    setLastPayload(payload);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Form Panel */}
          <div className="lg:sticky lg:top-6" style={{ overflow: "visible" }}>
            <ImageGenerationForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>
          {/* Right: Display + History */}
          <div className="flex flex-col gap-6">
            <ImageDisplay payload={lastPayload} isGenerating={isGenerating} />
            <PromptHistory />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
