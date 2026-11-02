async function run() {
  const fs = require('fs');
  const res = await fetch('https://composio.dev/logos/composio-full-black.svg');
  const text = await res.text();
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync('public/composio-logo.svg', text);
  console.log('Saved public/composio-logo.svg (length:', text.length, ')');
}
run();
