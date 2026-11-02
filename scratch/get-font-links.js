async function run() {
  const r = await fetch('https://composio.dev');
  const text = await r.text();
  const fontLinks = text.match(/https:\/\/[^"'\s]*font[^"'\s]*/gi) || [];
  console.log('Font links:', fontLinks);
  const fontFamilies = text.match(/font-family:[^;]+;/gi) || [];
  console.log('Font families:', fontFamilies.slice(0, 5));
}
run();
