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
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

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

  const handleCopyEnhancedPrompt = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    toast({
      title: "Copied!",
      description: "Enhanced prompt copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Prompt Section */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Original Prompt</CardTitle>
            <CardDescription className="text-gray-500">Enter your prompt here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Textarea
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Write your prompt..."
              className="min-h-[150px] rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
            <Button onClick={handleAnalyze} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200">
              Analyze Prompt
            </Button>
            <ScrollArea className="h-[100px] w-full rounded-md border">
              {analyzedIssues.length > 0 ? (
                <ul>
                  {analyzedIssues.map((issue, index) => (
                    <li key={index} className="text-sm p-2">- {issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm p-2 text-muted-foreground">No issues found.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Optimized Prompt Section */}
        <div className="flex flex-col space-y-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Corrected Prompt</CardTitle>
              <CardDescription className="text-gray-500">Refined version with spelling and grammar corrections.</CardDescription>
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

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Enhanced Prompt</CardTitle>
                <CardDescription className="text-gray-500">Further enhanced with context and structure.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyEnhancedPrompt}
                disabled={!enhancedPrompt}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <Icons.copy className="h-4 w-4" />
              </Button>
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

          <Button onClick={handleCorrectAndEnhance} className="bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 mt-auto">
            Correct and Enhance
          </Button>
        </div>
      </div>
    </div>
  );
}

