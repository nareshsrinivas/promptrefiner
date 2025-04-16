// src/ai/flows/analyze-prompt.ts
'use server';
/**
 * @fileOverview Analyzes a prompt for potential issues.
 *
 * - analyzePrompt - A function that analyzes a prompt for issues.
 * - AnalyzePromptInput - The input type for the analyzePrompt function.
 * - AnalyzePromptOutput - The return type for the analyzePrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to analyze.'),
});
export type AnalyzePromptInput = z.infer<typeof AnalyzePromptInputSchema>;

const AnalyzePromptOutputSchema = z.object({
  issues: z.array(z.string()).describe('A list of potential issues with the prompt.'),
});
export type AnalyzePromptOutput = z.infer<typeof AnalyzePromptOutputSchema>;

export async function analyzePrompt(input: AnalyzePromptInput): Promise<AnalyzePromptOutput> {
  return analyzePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePromptPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      issues: z.array(z.string()).describe('A list of potential issues with the prompt, such as spelling errors, grammatical mistakes, ambiguities, or vague instructions.'),
    }),
  },
  prompt: `Analyze the following prompt for potential issues such as spelling errors, grammatical mistakes, ambiguities, or vague instructions. Return a list of issues found.\n\nPrompt: {{{prompt}}}`,
});

const analyzePromptFlow = ai.defineFlow<
  typeof AnalyzePromptInputSchema,
  typeof AnalyzePromptOutputSchema
>({
  name: 'analyzePromptFlow',
  inputSchema: AnalyzePromptInputSchema,
  outputSchema: AnalyzePromptOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
