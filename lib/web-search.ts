import "server-only";

// Web search for the chat, used ONLY when the user opts in (composer toggle) and
// the space doesn't have the answer. Tavily first (LLM-tuned, clean results);
// on any failure — including quota exhaustion — fall back to Brave. Returns
// normalized results; never throws (an empty array just means "no web answer").

export type WebResult = { title: string; url: string; content: string };

async function viaTavily(query: string): Promise<WebResult[] | null> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query,
        max_results: 5,
        search_depth: "basic",
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null; // 4xx incl. quota exhausted → fall back to Brave
    const json = (await res.json()) as {
      results?: { title?: string; url?: string; content?: string }[];
    };
    return (json.results ?? [])
      .filter((r) => r.url)
      .map((r) => ({ title: r.title ?? r.url!, url: r.url!, content: r.content ?? "" }));
  } catch {
    return null;
  }
}

async function viaBrave(query: string): Promise<WebResult[] | null> {
  const key = process.env.BRAVE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: { "X-Subscription-Token": key, Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      web?: { results?: { title?: string; url?: string; description?: string }[] };
    };
    return (json.web?.results ?? [])
      .filter((r) => r.url)
      .map((r) => ({ title: r.title ?? r.url!, url: r.url!, content: r.description ?? "" }));
  } catch {
    return null;
  }
}

export async function webSearch(query: string): Promise<WebResult[]> {
  const tavily = await viaTavily(query);
  if (tavily && tavily.length) return tavily;
  const brave = await viaBrave(query);
  return brave ?? [];
}
