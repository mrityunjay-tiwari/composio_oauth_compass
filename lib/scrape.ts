import "server-only";

export type ScrapeStatus = "ok" | "thin" | "blocked" | "login" | "failed";
export type ScrapeResult = {
  markdown: string;
  status: ScrapeStatus;
  source: "jina-reader" | "direct";
  wordCount: number;
};

const BLOCK_RE =
  /verif(?:y|ies|ying)[^.]{0,24}(?:human|bot|robot)|are you a robot|you are not a bot|\bcaptcha\b|checking your browser|unusual traffic|access denied|just a moment|attention required|cf-browser-verification|performing security verification|protect against malicious bots|review the security of your connection|\bray id\b|enable javascript (?:and cookies )?to continue/i;
const LOGIN_RE =
  /sign ?in to (continue|read|view)|log ?in to (continue|read|view)|create (a )?(free )?account|subscribe to (read|continue)|members only|please log in|you must be logged in/i;

function wordCount(t: string): number {
  return t ? t.trim().split(/\s+/).filter(Boolean).length : 0;
}

function assess(markdown: string): ScrapeStatus {
  const wc = wordCount(markdown);
  if (BLOCK_RE.test(markdown)) return "blocked";
  if (LOGIN_RE.test(markdown)) return "login";
  if (wc < 40) return "thin";
  return "ok";
}

function stripJinaPreamble(text: string): string {
  const marker = text.indexOf("Markdown Content:");
  return marker >= 0 ? text.slice(marker + "Markdown Content:".length).trim() : text.trim();
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  try {
    const headers: Record<string, string> = {
      Accept: "text/plain",
      "X-Return-Format": "markdown",
    };
    if (process.env.JINA_API_KEY) {
      headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
    }
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers,
      signal: AbortSignal.timeout(25000),
    });
    if (res.ok) {
      const markdown = stripJinaPreamble(await res.text());
      return {
        markdown,
        status: assess(markdown),
        source: "jina-reader",
        wordCount: wordCount(markdown),
      };
    }
  } catch {
    // fallback to direct fetch if jina fails
  }

  try {
    const directRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(15000),
    });
    if (directRes.ok) {
      const html = await directRes.text();
      // basic text extraction
      const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                       .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
                       .replace(/<[^>]+>/g, " ")
                       .replace(/\s+/g, " ")
                       .trim();
      return {
        markdown: text,
        status: assess(text),
        source: "direct",
        wordCount: wordCount(text),
      };
    }
  } catch {
    // ignore
  }

  return { markdown: "", status: "failed", source: "jina-reader", wordCount: 0 };
}
