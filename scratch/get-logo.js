async function run() {
  try {
    const r = await fetch('https://composio.dev');
    const text = await r.text();
    const faviconMatch = text.match(/href="([^"]*favicon[^"]*)"/i) || text.match(/href="([^"]*logo[^"]*)"/i);
    console.log('Favicon match:', faviconMatch ? faviconMatch[1] : null);
    
    // Look for svgs
    const svgs = text.match(/<svg[\s\S]*?<\/svg>/gi) || [];
    console.log('Total SVGs found:', svgs.length);
    for (const s of svgs) {
      if (s.includes('0 0 24 24') || s.includes('0 0 32 32') || s.toLowerCase().includes('logo')) {
        console.log('--- SVG ---');
        console.log(s);
      }
    }
  } catch(e) {
    console.error(e);
  }
}
run();
