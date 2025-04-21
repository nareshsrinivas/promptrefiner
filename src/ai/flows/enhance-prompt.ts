'use server';
/**
 * @fileOverview Enhances a user-provided prompt by adding context,
 * structuring it logically, and providing clear instructions for better LLM results,
 * while also showcasing few-shot, one-shot, and chain-of-thought prompting techniques.
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

Here are some examples of prompt engineering techniques you can use:

**Few-shot prompting:** Provide 2-3 well-formed examples that demonstrate the desired output.
**Example 1:**
Original Prompt: "write an email"
Enhanced Prompt: "Write a professional email to a client, John Doe, thanking him for his recent purchase and offering support. Include the order number and a link to our FAQ."

**Example 2:**
Original Prompt: "summarize a book"
Enhanced Prompt: "Summarize the key plot points and themes of 'The Great Gatsby' by F. Scott Fitzgerald in under 200 words. Focus on Gatsby's motivations and the symbolism of the green light."

**One-shot prompting:** Present a single, high-quality example that encompasses the best practices for the task.
**Example:**
Original Prompt: "translate to spanish"
Enhanced Prompt: "Translate the following English sentence to Spanish, ensuring grammatical accuracy and natural-sounding phrasing: 'Hello, how are you today?'"

**Chain-of-thought prompting:** Outline a reasoning pathway that explains how to approach the task logically to enhance understanding and engagement.
**Example:**
Original Prompt: "solve this math problem"
Enhanced Prompt: "First, identify the type of math problem (algebra, calculus, etc.). Then, break down the problem into smaller steps. Solve each step sequentially. Finally, combine the results to arrive at the final answer. The problem is: 2x + 5 = 15."

Now, enhance the following prompt using the techniques above:

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
