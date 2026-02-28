import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Wand2 } from "lucide-react";
import { useSendQuery } from "../hooks/useQueries";
import { OnGeneratePayload } from "../App";
import { EMOTIONS, buildEmotionPrompt } from "../constants/emotions";
import {
  NEGATIVE_PROMPT_PRESET_OPTIONS,
  NegativePromptPreset,
} from "../constants/negativePrompts";

interface Props {
  onGenerate: (payload: OnGeneratePayload) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

const ART_STYLES = [
  "Photorealistic",
  "Oil Painting",
  "Watercolor",
  "Sketch",
  "Digital Art",
  "Anime",
  "Cinematic",
  "Fashion Editorial",
  "Fine Art",
  "Street Photography",
];

const ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2"];

const ETHNICITIES = [
  "Black",
  "White",
  "Asian",
  "Hispanic/Latino",
  "Middle Eastern",
  "South Asian",
  "Mixed",
  "Other",
];

const BODY_TYPES = [
  "Slim",
  "Athletic",
  "Average",
  "Curvy",
  "Plus Size",
  "Petite",
  "Tall",
  "Muscular",
];

const CLOTHING_STYLES = [
  "Casual",
  "Business Casual",
  "Formal",
  "Haute Couture",
  "Streetwear",
  "Bohemian",
  "Sportswear",
  "Vintage",
  "Minimalist",
  "Avant-garde",
];

const CAMERA_LENSES = [
  "35mm",
  "50mm",
  "85mm",
  "24mm",
  "105mm",
  "Wide Angle",
  "Telephoto",
  "Macro",
];

const CAMERA_ANGLES = [
  "Eye Level",
  "Low Angle",
  "High Angle",
  "Bird's Eye",
  "Dutch Angle",
  "Over the Shoulder",
  "Close-up",
  "Medium Shot",
  "Full Body",
];

const LIGHTING_OPTIONS = [
  "Natural Daylight",
  "Golden Hour",
  "Studio Lighting",
  "Dramatic Shadows",
  "Soft Diffused",
  "Neon",
  "Candlelight",
  "Backlit",
  "Overcast",
];

const ENVIRONMENTS = [
  "Studio",
  "Urban Street",
  "Nature/Forest",
  "Beach",
  "Indoor Home",
  "Office",
  "Rooftop",
  "Park",
  "Desert",
  "Mountain",
];

const COMPOSITIONS = [
  "Rule of Thirds",
  "Centered",
  "Symmetrical",
  "Leading Lines",
  "Frame within Frame",
  "Negative Space",
  "Golden Ratio",
];

const POSES = [
  "Standing",
  "Sitting",
  "Walking",
  "Running",
  "Lying Down",
  "Leaning",
  "Jumping",
  "Crouching",
];

const FIGURATION_OPTIONS = [
  "Solo",
  "Couple",
  "Group",
  "With Props",
  "Environmental",
];

const POSING_STYLES = [
  "Natural/Candid",
  "Editorial",
  "Power Pose",
  "Relaxed",
  "Dynamic",
  "Elegant",
  "Playful",
];

export default function ImageGenerationForm({
  onGenerate,
  isGenerating,
  setIsGenerating,
}: Props) {
  const [bodyType, setBodyType] = useState("Curvy");
  const [age, setAge] = useState("25");
  const [ethnicity, setEthnicity] = useState("Black");
  const [artStyle, setArtStyle] = useState("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState("4:3");
  const [cameraLens, setCameraLens] = useState("50mm");
  const [cameraAngle, setCameraAngle] = useState("Eye Level");
  const [clothing, setClothing] = useState("Casual");
  const [environment, setEnvironment] = useState("Studio");
  const [lighting, setLighting] = useState("Natural Daylight");
  const [composition, setComposition] = useState("Rule of Thirds");
  const [situationPose, setSituationPose] = useState("Standing");
  const [situationFiguration, setSituationFiguration] = useState("Solo");
  const [situationBehavior, setSituationBehavior] = useState("");
  const [situationPosing, setSituationPosing] = useState("Natural/Candid");
  const [negativePreset, setNegativePreset] = useState<NegativePromptPreset>("quality");
  const [customNegative, setCustomNegative] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedIntensity, setSelectedIntensity] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const sendQuery = useSendQuery();

  const buildPrompt = () => {
    const parts: string[] = [];

    if (artStyle) parts.push(`${artStyle} style`);
    if (bodyType) parts.push(`${bodyType} body type`);
    if (ethnicity) parts.push(`${ethnicity} person`);
    if (age) parts.push(`${age} years old`);
    if (clothing) parts.push(`wearing ${clothing}`);
    if (environment) parts.push(`${environment} environment`);
    if (cameraAngle) parts.push(`${cameraAngle} shot`);
    if (cameraLens) parts.push(`${cameraLens} lens`);
    if (lighting) parts.push(`${lighting} lighting`);
    if (composition) parts.push(`${composition} composition`);
    if (situationPose) parts.push(`${situationPose} pose`);
    if (situationFiguration) parts.push(situationFiguration);
    if (situationPosing) parts.push(`${situationPosing} posing`);
    if (situationBehavior) parts.push(situationBehavior);

    if (selectedEmotion && selectedIntensity) {
      const emotionText = buildEmotionPrompt(selectedEmotion, selectedIntensity);
      if (emotionText) parts.push(emotionText);
    }

    if (additionalDetails.trim()) parts.push(additionalDetails.trim());

    return parts.join(", ");
  };

  const getNegativePrompt = () => {
    const preset = NEGATIVE_PROMPT_PRESET_OPTIONS.find((p) => p.value === negativePreset);
    const base = preset?.prompt ?? "";
    return customNegative ? `${base}, ${customNegative}` : base;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const prompt = buildPrompt();
    const negativePrompt = getNegativePrompt();

    const criteria = {
      bodyType,
      age: parseInt(age) || 0,
      ethnicity,
      artStyle,
      height: 0,
      weight: 0,
      negativePrompt,
      aspectRatio,
      cameraLens,
      clothing,
      situationPose,
      situationFiguration,
      situationBehavior,
      situationPosing,
      cameraAngle,
      lighting,
      environment,
      composition,
    };

    try {
      await sendQuery.mutateAsync({
        criteria: {
          ...criteria,
          age: BigInt(criteria.age),
        },
        combinations: prompt,
      });
    } catch {
      // ignore backend errors, still show prompt
    }

    onGenerate({ prompt, criteria });
    setIsGenerating(false);
  };

  const emotionCategories = Object.keys(EMOTIONS);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Subject
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Body Type</Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {BODY_TYPES.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Ethnicity</Label>
              <Select value={ethnicity} onValueChange={setEthnicity}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {ETHNICITIES.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Age</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Style & Art</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Art Style</Label>
              <Select value={artStyle} onValueChange={setArtStyle}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {ART_STYLES.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {ASPECT_RATIOS.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Clothing Style</Label>
            <Select value={clothing} onValueChange={setClothing}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[99999]">
                {CLOTHING_STYLES.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Camera & Lighting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Camera Lens</Label>
              <Select value={cameraLens} onValueChange={setCameraLens}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {CAMERA_LENSES.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Camera Angle</Label>
              <Select value={cameraAngle} onValueChange={setCameraAngle}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {CAMERA_ANGLES.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Lighting</Label>
              <Select value={lighting} onValueChange={setLighting}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {LIGHTING_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Environment</Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {ENVIRONMENTS.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Composition</Label>
            <Select value={composition} onValueChange={setComposition}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[99999]">
                {COMPOSITIONS.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Pose & Scene</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Pose</Label>
              <Select value={situationPose} onValueChange={setSituationPose}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {POSES.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Figuration</Label>
              <Select value={situationFiguration} onValueChange={setSituationFiguration}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {FIGURATION_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Posing Style</Label>
            <Select value={situationPosing} onValueChange={setSituationPosing}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[99999]">
                {POSING_STYLES.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Behavior / Action (optional)</Label>
            <Input
              value={situationBehavior}
              onChange={(e) => setSituationBehavior(e.target.value)}
              placeholder="e.g. laughing joyfully while twirling"
              className="h-8 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Emotion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Emotion Category</Label>
              <Select
                value={selectedEmotion}
                onValueChange={(v) => {
                  setSelectedEmotion(v);
                  setSelectedIntensity("");
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  <SelectItem value="" className="text-xs">None</SelectItem>
                  {emotionCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Intensity</Label>
              <Select
                value={selectedIntensity}
                onValueChange={setSelectedIntensity}
                disabled={!selectedEmotion}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99999]">
                  {selectedEmotion &&
                    Object.keys(EMOTIONS[selectedEmotion as keyof typeof EMOTIONS] || {}).map(
                      (intensity) => (
                        <SelectItem key={intensity} value={intensity} className="text-xs">
                          {intensity}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Negative Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Preset</Label>
            <Select
              value={negativePreset}
              onValueChange={(v) => setNegativePreset(v as NegativePromptPreset)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[99999]">
                {NEGATIVE_PROMPT_PRESET_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Additional (optional)</Label>
            <Textarea
              value={customNegative}
              onChange={(e) => setCustomNegative(e.target.value)}
              placeholder="Add custom negative prompts…"
              className="text-xs min-h-[60px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Any extra details to include in the prompt…"
            className="text-xs min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>

      <Separator />

      <Button
        type="submit"
        disabled={isGenerating}
        className="w-full h-10 font-semibold text-sm gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Building Prompt…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate Prompt
          </>
        )}
      </Button>
    </form>
  );
}
