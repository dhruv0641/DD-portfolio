import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

// ════════════════════════════════════════════════════════════════════════════
// STREAMING ROUTE HANDLER (FULLY MANAGED)
// ════════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const { messages, model, temperature } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Resolve API Keys purely server-side
    const googleKey = process.env.GOOGLE_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // ── RATE LIMITING CHECK (ALL REQUESTS ENFORCED) ──
    const ip = getClientIp(req);
    const limitStatus = await checkRateLimit(ip, true);

    if (!limitStatus.allowed) {
      const retrySecs = Math.max(1, Math.ceil((limitStatus.resetTime - Date.now()) / 1000));
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'You have reached the limit of 2 AI requests this hour. The Playground resets every hour.',
          retryAfter: retrySecs,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retrySecs),
          },
        }
      );
    }

    const isGemini = model.startsWith('gemini');

    // ── GOOGLE GEMINI PROVIDER ──
    if (isGemini) {
      if (!googleKey) {
        return NextResponse.json(
          { error: 'Gemini model is currently offline (Key not configured by owner).' },
          { status: 503 }
        );
      }

      const geminiModel = model === 'gemini-pro' ? 'gemini-pro' : 'gemini-2.5-flash';

      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?key=${googleKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: temperature ?? 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini API stream error:', errText);
        return NextResponse.json({ error: 'Failed to establish stream connection with Gemini API.' }, { status: 502 });
      }

      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const cleanedLine = line.trim();
                if (!cleanedLine) continue;

                try {
                  const chunkJson = JSON.parse(cleanedLine.replace(/^,/, '').trim());
                  const text = chunkJson.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                  }
                } catch (e) {}
              }
            }

            if (buffer.trim()) {
              try {
                const chunkJson = JSON.parse(buffer.replace(/^,/, '').trim());
                const text = chunkJson.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text));
                }
              } catch (e) {}
            }
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    // ── GROQ PROVIDER ──
    if (!isGemini) {
      if (!groqKey) {
        return NextResponse.json(
          { error: 'Llama model is currently offline (Key not configured by owner).' },
          { status: 503 }
        );
      }

      const groqModel = model === 'groq-mixtral' ? 'mixtral-8x7b-32768' : 'llama3-8b-8192';

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: groqModel,
          messages: messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: temperature ?? 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Groq API stream error:', errText);
        return NextResponse.json({ error: 'Failed to establish stream connection with Groq API.' }, { status: 502 });
      }

      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const cleanedLine = line.trim();
                if (!cleanedLine.startsWith('data:')) continue;

                const dataContent = cleanedLine.replace(/^data:\s*/, '').trim();
                if (dataContent === '[DONE]') {
                  break;
                }

                try {
                  const chunkJson = JSON.parse(dataContent);
                  const text = chunkJson.choices?.[0]?.delta?.content;
                  if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                  }
                } catch (e) {}
              }
            }
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported model selection' }, { status: 400 });
  } catch (err: any) {
    console.error('API Stream Handler crashed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
