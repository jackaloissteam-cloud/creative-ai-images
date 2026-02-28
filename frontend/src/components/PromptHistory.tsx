import { useState } from "react";
import { useGetPromptHistory } from "../hooks/useQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

export default function PromptHistory() {
  const { data: history, isLoading } = useGetPromptHistory();
  const [expanded, setExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sorted = history
    ? [...history].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  const visible = expanded ? sorted : sorted.slice(0, 3);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Prompt History
            {sorted.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-auto">
                {sorted.length}
              </Badge>
            )}
          </CardTitle>
          {sorted.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-7 px-2 text-xs gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> More
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading history…</p>
        ) : sorted.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No prompts generated yet. Submit the form to start building your history.
          </p>
        ) : (
          <div className="space-y-2">
            {visible.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-2 rounded-lg bg-muted/40 border border-border p-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-mono break-words line-clamp-2">
                    {item.prompt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(Number(item.timestamp) / 1_000_000).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(item.prompt, i)}
                >
                  {copiedIndex === i ? (
                    <Check className="w-3 h-3 text-primary" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
