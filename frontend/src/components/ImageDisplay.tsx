import { OnGeneratePayload } from "../App";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImageDisplayProps {
  payload: OnGeneratePayload | null;
  isGenerating: boolean;
}

export default function ImageDisplay({ payload, isGenerating }: ImageDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!payload?.prompt) return;
    await navigator.clipboard.writeText(payload.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Building your prompt…</p>
        </CardContent>
      </Card>
    );
  }

  if (!payload) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Sparkles className="w-12 h-12 text-primary opacity-60" />
          <p className="text-muted-foreground text-sm max-w-xs">
            Fill in the form and click <strong>Generate Prompt</strong> to see your assembled prompt here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const c = payload.criteria;

  const paramRows = [
    { label: "Body Type", value: c.bodyType },
    { label: "Ethnicity", value: c.ethnicity },
    { label: "Age", value: c.age ? `${c.age} years` : "" },
    { label: "Art Style", value: c.artStyle },
    { label: "Aspect Ratio", value: c.aspectRatio },
    { label: "Camera Lens", value: c.cameraLens },
    { label: "Camera Angle", value: c.cameraAngle },
    { label: "Clothing", value: c.clothing },
    { label: "Environment", value: c.environment },
    { label: "Lighting", value: c.lighting },
    { label: "Composition", value: c.composition },
    { label: "Pose", value: c.situationPose },
    { label: "Figuration", value: c.situationFiguration },
    { label: "Behavior", value: c.situationBehavior },
    { label: "Posing", value: c.situationPosing },
  ].filter((r) => r.value && r.value.trim() !== "");

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Generated Prompt
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Full prompt text */}
        <div className="rounded-lg bg-muted/50 border border-border p-3">
          <p className="text-sm leading-relaxed text-foreground font-mono break-words whitespace-pre-wrap">
            {payload.prompt}
          </p>
        </div>

        {/* Negative prompt */}
        {c.negativePrompt && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-xs font-semibold text-destructive mb-1">Negative Prompt</p>
            <p className="text-xs text-muted-foreground font-mono break-words">
              {c.negativePrompt}
            </p>
          </div>
        )}

        {/* Parameter breakdown */}
        {paramRows.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Parameters
            </p>
            <div className="flex flex-wrap gap-2">
              {paramRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-1 rounded-full bg-muted/60 border border-border px-2 py-0.5"
                >
                  <span className="text-xs text-muted-foreground">{row.label}:</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-auto rounded-full">
                    {row.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic">
          Copy this prompt and use it in your preferred AI image generator (Midjourney, DALL·E, Stable Diffusion, etc.)
        </p>
      </CardContent>
    </Card>
  );
}
