"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { analyzePrompt } from "@/ai/flows/analyze-prompt";
import { correctPrompt } from "@/ai/flows/correct-prompt";
import { enhancePrompt } from "@/ai/flows/enhance-prompt";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [analyzedIssues, setAnalyzedIssues] = useState<string[]>([]);
  const [correctedPrompt, setCorrectedPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [correctExplanation, setCorrectExplanation] = useState("");
  const [enhanceExplanation, setEnhanceExplanation] = useState("");

  const handleAnalyze = async () => {
    const analysisResult = await analyzePrompt({ prompt: originalPrompt });
    setAnalyzedIssues(analysisResult.issues);
  };

  const handleCorrectAndEnhance = async () => {
    const correctionResult = await correctPrompt({ prompt: originalPrompt });
    setCorrectedPrompt(correctionResult.correctedPrompt);
    setCorrectExplanation(correctionResult.explanation);

    const enhancementResult = await enhancePrompt({
      prompt: correctionResult.correctedPrompt,
    });
    setEnhancedPrompt(enhancementResult.enhancedPrompt);
    setEnhanceExplanation(enhancementResult.explanation);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 space-y-4 md:space-x-4 md:space-y-0">
      {/* Original Prompt Section */}
      <div className="md:w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Original Prompt</CardTitle>
            <CardDescription>Enter your prompt here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Textarea
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Write your prompt..."
              className="min-h-[150px]"
            />
            <Button onClick={handleAnalyze} variant="secondary">
              Analyze Prompt
            </Button>
            <ScrollArea className="h-[100px] w-full rounded-md border">
              {analyzedIssues.length > 0 ? (
                <ul>
                  {analyzedIssues.map((issue, index) => (
                    <li key={index} className="text-sm">
                      - {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm p-2 text-muted-foreground">
                  No issues found.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Optimized Prompt Section */}
      <div className="md:w-1/2 flex flex-col space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Corrected Prompt</CardTitle>
            <CardDescription>
              Refined version with spelling and grammar corrections.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <ScrollArea className="h-[150px] w-full rounded-md border">
              <p className="p-2">{correctedPrompt || "Not corrected yet."}</p>
            </ScrollArea>
            <p className="text-sm text-muted-foreground">
              Explanation: {correctExplanation || "No explanation available."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enhanced Prompt</CardTitle>
            <CardDescription>
              Further enhanced with context and structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <ScrollArea className="h-[150px] w-full rounded-md border">
              <p className="p-2">{enhancedPrompt || "Not enhanced yet."}</p>
            </ScrollArea>
            <p className="text-sm text-muted-foreground">
              Explanation: {enhanceExplanation || "No explanation available."}
            </p>
          </CardContent>
        </Card>

        <Button onClick={handleCorrectAndEnhance} className="mt-auto">
          Correct and Enhance
        </Button>
      </div>
    </div>
  );
}
