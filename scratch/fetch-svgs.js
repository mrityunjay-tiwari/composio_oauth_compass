async function run() {
  const urls = [
    'https://composio.dev/logos/composio-full-black.svg',
    'https://composio.dev/logos/composio-mark.svg',
    'https://composio.dev/logos/composio-logo.svg',
    'https://composio.dev/favicon.svg'
  ];
  for (let u of urls) {
    try {
      const res = await fetch(u);
      console.log(u, res.status);
      if (res.ok) {
        const text = await res.text();
        console.log('Content preview:', text.slice(0, 150));
      }
    } catch(e) {
      console.log(u, 'error');
    }
  }
}
run();
