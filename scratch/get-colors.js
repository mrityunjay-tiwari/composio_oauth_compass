async function run() {
  const r = await fetch('https://composio.dev');
  const text = await r.text();
  const blues = text.match(/#[0-9a-f]{6}/gi) || [];
  const blueCounts = {};
  for (let c of blues) {
    c = c.toLowerCase();
    blueCounts[c] = (blueCounts[c] || 0) + 1;
  }
  console.log('Top colors:', Object.entries(blueCounts).sort((a,b) => b[1]-a[1]).slice(0, 15));
}
run();
