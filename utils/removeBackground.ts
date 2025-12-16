export async function removeBackground(imageFile: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");

  const apiKey = process.env.NEXT_PUBLIC_REMOVE_BG_KEY;

  if (!apiKey) {
    throw new Error("Missing remove.bg API Key");
  }

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to remove background");
  }

  return await response.blob(); // Returns the clean image as a Blob
}