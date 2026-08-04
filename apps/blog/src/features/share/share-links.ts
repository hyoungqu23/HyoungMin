export type SocialSharePlatform =
  "linkedin" | "facebook" | "x" | "reddit" | "threads";

export type AiContentProvider = "chatgpt" | "claude" | "grok";

export const buildSocialShareUrl = (
  platform: SocialSharePlatform,
  contentUrl: string,
  title: string,
): string => {
  const encodedUrl = encodeURIComponent(contentUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "threads":
      return `https://www.threads.net/intent/post?text=${encodedUrl}`;
  }
};

export const buildAiContentUrl = (
  provider: AiContentProvider,
  contentUrl: string,
): string => {
  const prompt = `Read ${contentUrl} summarize and answer questions about the content`;
  const encodedPrompt = encodeURIComponent(prompt);

  switch (provider) {
    case "chatgpt":
      return `https://chatgpt.com/?prompt=${encodedPrompt}`;
    case "claude":
      return `https://claude.ai/new?q=${encodedPrompt}`;
    case "grok":
      return `https://grok.com?q=${encodedPrompt}`;
  }
};
