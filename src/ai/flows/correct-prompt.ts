'use server';
/**
 * @fileOverview A prompt correction AI agent.
 *
 * - correctPrompt - A function that handles the prompt correction process.
 * - CorrectPromptInput - The input type for the correctPrompt function.
 * - CorrectPromptOutput - The return type for the correctPrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CorrectPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be corrected.'),
});
export type CorrectPromptInput = z.infer<typeof CorrectPromptInputSchema>;

const CorrectPromptOutputSchema = z.object({
  correctedPrompt: z.string().describe('The corrected prompt.'),
  explanation: z.string().describe('The explanation of the corrections made.'),
});
export type CorrectPromptOutput = z.infer<typeof CorrectPromptOutputSchema>;

export async function correctPrompt(input: CorrectPromptInput): Promise<CorrectPromptOutput> {
  return correctPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctPromptPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt to be corrected.'),
    }),
  },
  output: {
    schema: z.object({
      correctedPrompt: z.string().describe('The corrected prompt, with spelling and grammar corrected.'),
      explanation: z.string().describe('The explanation of the corrections made.'),
    }),
  },
  prompt: `You are an AI expert in correcting spelling and grammatical errors in prompts.

  Correct the following prompt, and provide a brief explanation of the changes you made.

  Prompt: {{{prompt}}}

  Respond with the corrected prompt and explanation.
  `,
});

const correctPromptFlow = ai.defineFlow<
  typeof CorrectPromptInputSchema,
  typeof CorrectPromptOutputSchema
>(
  {
    name: 'correctPromptFlow',
    inputSchema: CorrectPromptInputSchema,
    outputSchema: CorrectPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
