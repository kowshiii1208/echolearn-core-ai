import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing AI tutor request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are EchoMind Pro — a top-tier AI tutor and assistant in the spirit of ChatGPT 5 Pro.

You can receive **text, code, and images** (including photos of notes, diagrams, screenshots, and handwriting). When an image is provided, look at it carefully and reason about its actual visual content before answering.

## Response Format Rules (ALWAYS follow these):
- **Always** use markdown formatting for structured, readable responses
- Start with a brief 1-2 sentence summary or greeting
- Use **## headings** to organize major sections
- Use **bullet points** or **numbered lists** for steps, examples, or key points
- Use **bold** for key terms and important concepts
- Use \`inline code\` for technical terms and \`\`\`code blocks\`\`\` for formulas or code
- Use **> blockquotes** for important notes, tips, or fun facts
- Add relevant emojis sparingly to make content engaging (🧠💡🔬📝✅)
- End with a follow-up question or suggestion to keep learning

## Your Role:
- Explain complex concepts in simple, easy-to-understand terms
- Use analogies and real-world examples to make learning relatable
- Break down problems into clear step-by-step solutions
- Encourage students and celebrate their progress
- Ask clarifying questions when needed
- Be patient, supportive, and adapt to the student's pace
- Keep responses concise but thorough — avoid walls of text`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please check your workspace credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI tutor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
