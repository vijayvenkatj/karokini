"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET_NAME = "karoke-files";

export const storeAudio = async (
  chunks: Blob[],
  mimeType: string,
  songName: string
) => {
  const audioBlob = new Blob(chunks, { type: mimeType });
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user || !user.email) {
      return { success: false, error: "User not authenticated" };
    }

    const extension = mimeType.split("/")[1] || "webm";
    const safeSongName = encodeURIComponent(songName);
    const safeEmail = encodeURIComponent(user.email);
    const fileName = `audio/${safeSongName}-${Date.now()}-${safeEmail}.${extension}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, audioBlob);

    if (error) throw error;

    revalidatePath("/recorder");

    return { success: true, data };
  } catch (err: any) {
    console.error("Upload Error:", err.message);
    return { success: false, error: err.message || "Upload failed" };
  }
};

export const getUserAudio = async () => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user || !user.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { data: list, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list("audio");

    if (listError) throw listError;

    // FIX: don't encode email when filtering
    const userFileList =
      list?.filter((file) => file.name.includes(user.email!)) || [];

    const userAudioPaths = userFileList.map((file) => `audio/${file.name}`);

    if (userAudioPaths.length === 0) {
      return { success: true, signedUrls: [] };
    }

    const { data: signedUrls, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrls(userAudioPaths, 3600); // 1 hour

    if (urlError) throw urlError;

    return {
      success: true,
      signedUrls: signedUrls.map((url) => ({
        signedUrl: url.signedUrl,
        path: url.path,
      })),
    };
  } catch (err: any) {
    console.error("Fetch Audio Error:", err.message);
    return { success: false, error: err.message || "Could not fetch audio" };
  }
};
