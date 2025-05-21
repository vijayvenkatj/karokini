"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
export const storeAudio = async (chunks: Blob[]) => {
  const AudioBlob = new Blob(chunks, { type: "audio/webm" });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const bucketName = "karoke-files";
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`audio/${user.email! + Date.now()}.webm`, AudioBlob);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/recorder");

  return { success: true, data };
};

export const getUserAudio = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return { success: false, error: error.message };
  }
  const bucketName = "karoke-files";

  const { data: list, error: listError } = await supabase.storage
    .from(bucketName)
    .list("audio");
  if (listError) {
    return { success: false, error: listError.message };
  }

  const userFileList = list.filter((l) => l.name.startsWith(user?.email!));
  const userAudiopaths = userFileList.map((file) => `audio/${file.name}`);

  const { data: signedUrls, error: urlError } = await supabase.storage
    .from(bucketName)
    .createSignedUrls(userAudiopaths, 3600);

  if (urlError) {
    return { success: false, error: urlError.message };
  }
  if (signedUrls?.length == 0) {
    return { success: true, signedUrls: [] };
  }

  if (signedUrls) {
    return {
      success: true,
      signedUrls: signedUrls.map((url) => ({
        signedUrl: url.signedUrl,
        path: url.path,
      })),
    };
  }
};
