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

  const result = streamText({
    model: defaultModel,
    system: SYSTEM_PROMPT,
    messages,
    tools: aiTools,
  });

  return result.toUIMessageStreamResponse();
}
