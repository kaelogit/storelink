import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image_file') as File;
    if (!imageFile) return NextResponse.json({ error: "No image" }, { status: 400 });

    const apiKeys = [
      process.env.REMOVE_BG_KEY_1, process.env.REMOVE_BG_KEY_2,
      process.env.REMOVE_BG_KEY_3, process.env.REMOVE_BG_KEY_4,
      process.env.REMOVE_BG_KEY_5, process.env.REMOVE_BG_KEY_6,
      process.env.REMOVE_BG_KEY_7, process.env.REMOVE_BG_KEY_8,
      process.env.REMOVE_BG_KEY_9, process.env.REMOVE_BG_KEY_10,
      process.env.REMOVE_BG_KEY_11,
    ].filter(Boolean);

    for (const key of apiKeys) {
      const removeBgFormData = new FormData();
      removeBgFormData.append('image_file', imageFile);
      removeBgFormData.append('size', 'auto');

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": key as string },
        body: removeBgFormData,
      });

      // If key is empty (402), jump to next key
      if (response.status === 402) {
        console.log(`Key ${key?.slice(0, 5)}... empty. Rotating...`);
        continue; 
      }

      if (response.ok) {
        const blob = await response.blob();
        return new NextResponse(blob, { headers: { 'Content-Type': 'image/png' } });
      }
    }

    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 402 });

  } catch (error: any) {
    return NextResponse.json({ error: "AI_BUSY" }, { status: 500 });
  }
}