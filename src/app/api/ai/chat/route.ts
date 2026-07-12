import { streamText } from 'ai';
import { defaultModel } from '@/features/ai/config/model-config';
import { SYSTEM_PROMPT } from '@/features/ai/prompts/system-prompt';
import { aiTools } from '@/features/ai/services/ai-tools';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Validate user session before allowing AI access
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Sanitize messages to match ModelMessage[] schema
  const sanitizedMessages = (messages || []).map((m: any) => {
    let content = m.content;
    if (content === undefined && Array.isArray(m.parts)) {
      const textPart = m.parts.find((p: any) => p.type === "text");
      content = textPart ? textPart.text : "";
    }
    return {
      role: m.role,
      content: content || "",
    };
  });

  const result = streamText({
    model: defaultModel,
    system: SYSTEM_PROMPT,
    messages: sanitizedMessages,
    tools: aiTools,
  });

  return result.toTextStreamResponse();
}
