// This file is machine-generated - do not edit!
'use server';
/**
 * @fileOverview Enhances a user-provided prompt by adding context,
 * structuring it logically, and providing clear instructions for better LLM results.
 *
 * - enhancePrompt - A function that enhances the prompt.
 * - EnhancePromptInput - The input type for the enhancePrompt function.
 * - EnhancePromptOutput - The return type for the enhancePrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const EnhancePromptInputSchema = z.object({
  prompt: z.string().describe('The original prompt to be enhanced.'),
});
export type EnhancePromptInput = z.infer<typeof EnhancePromptInputSchema>;

const EnhancePromptOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced version of the prompt.'),
  explanation: z.string().describe('Explanation of the enhancements made.'),
});
export type EnhancePromptOutput = z.infer<typeof EnhancePromptOutputSchema>;

export async function enhancePrompt(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  return enhancePromptFlow(input);
}

const enhancePromptPrompt = ai.definePrompt({
  name: 'enhancePromptPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The original prompt to be enhanced.'),
    }),
  },
  output: {
    schema: z.object({
      enhancedPrompt: z.string().describe('The enhanced version of the prompt.'),
      explanation: z.string().describe('Explanation of the enhancements made, including why each change was made.'),
    }),
  },
  prompt: `You are an expert prompt enhancer. Your goal is to improve the quality of a user's prompt so that they receive better results from language models.

Analyze the prompt for its intent, structure, and potential areas of improvement. Refine the prompt while preserving the user's original intent.

Consider adding necessary context, structuring the prompt logically (context -> task -> format), and including clear instructions for format, length, or style where applicable. Focus on clarity, specificity, and actionable instructions. Consider what context would help the LLM understand the request better.

Provide the enhanced version of the prompt, along with explanations for the changes you made.

Original Prompt: {{{prompt}}}

Enhanced Prompt:
`, // No Handlebars logic; LLM completes the prompt.
});

const enhancePromptFlow = ai.defineFlow<
  typeof EnhancePromptInputSchema,
  typeof EnhancePromptOutputSchema
>(
  {
    name: 'enhancePromptFlow',
    inputSchema: EnhancePromptInputSchema,
    outputSchema: EnhancePromptOutputSchema,
  },
  async input => {
    const {output} = await enhancePromptPrompt(input);
    return output!;
  }
);
