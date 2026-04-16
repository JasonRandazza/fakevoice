import { NextRequest, NextResponse } from "next/server";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

export async function GET() {
  const xiApiKey = process.env.XI_API_KEY;
  if (!xiApiKey) {
    return NextResponse.json({ error: "Missing ElevenLabs API Key" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": xiApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API returned ${response.status}`);
    }

    const result = await response.json();
    // Return voices generated or cloned by the user
    const voices = result.voices.filter(
      (v: Voice) => v.category === "generated" || v.category === "cloned"
    );

    return NextResponse.json(voices);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Undefined error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const xiApiKey = process.env.XI_API_KEY;
  if (!xiApiKey) {
    return new NextResponse("Missing ElevenLabs API Key", { status: 500 });
  }

  try {
    const { text, voiceId } = await req.json();

    if (!text || !voiceId) {
      return new NextResponse("Missing text or voiceId", { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`,
      {
        method: "POST",
        headers: {
          "xi-api-key": xiApiKey,
          "Content-Type": "application/json",
          accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Forward the stream from ElevenLabs to the client
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Undefined error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}