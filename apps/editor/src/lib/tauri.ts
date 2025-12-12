// Tauri API utilities
// These functions are only available when running in Tauri context

export async function isTauri(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const { getTauriVersion } = await import("@tauri-apps/api/app");
    await getTauriVersion();
    return true;
  } catch {
    return false;
  }
}

export interface ProcessImageResult {
  path: string;
  localPath: string;
}

export async function processImage(
  fileName: string,
  data: number[],
): Promise<ProcessImageResult> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<ProcessImageResult>("process_image", { fileName, data });
}

export interface SubmitPostMetadata {
  title: string;
  description: string;
  createdAt: string;
  category?: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  cover?: string;
  draft: boolean;
}

export async function submitPost(
  metadata: SubmitPostMetadata,
  content: string,
  localImages: Record<string, string>,
): Promise<void> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke("submit_post", {
    metadata,
    content,
    localImages,
  });
}

export async function saveDraft(
  metadata: SubmitPostMetadata,
  content: string,
): Promise<void> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke("save_draft", { metadata, content });
}

export async function selectImageFile(): Promise<string | null> {
  const { open } = await import("@tauri-apps/plugin-dialog");

  const selected = await open({
    multiple: false,
    filters: [
      {
        name: "Images",
        extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp"],
      },
    ],
  });

  if (typeof selected === "string") {
    return selected;
  }

  return null;
}
