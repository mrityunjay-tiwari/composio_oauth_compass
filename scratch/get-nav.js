async function run() {
  const r = await fetch('https://composio.dev');
  const text = await r.text();
  const nav = text.match(/<header[\s\S]*?<\/header>/i) || text.match(/<nav[\s\S]*?<\/nav>/i);
  if (nav) {
    console.log(nav[0].slice(0, 1500));
  } else {
    console.log('No header/nav found');
  }
}
run();
