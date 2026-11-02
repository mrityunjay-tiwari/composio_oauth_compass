async function run() {
  const r = await fetch('https://composio.dev');
  const text = await r.text();
  const fontMatches = text.match(/font-[a-zA-Z0-9_-]+/g) || [];
  console.log('Font classes:', [...new Set(fontMatches)]);
  const styleFonts = text.match(/--font-[a-zA-Z0-9_-]+/g) || [];
  console.log('Font vars:', [...new Set(styleFonts)]);
}
run();
