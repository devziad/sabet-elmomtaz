async function run() {
  const res = await fetch('https://www.youtube.com/@Mogzz');
  const text = await res.text();
  const match = text.match(/"externalId":"(UC[^"]+)"/);
  if (match) {
    const channelId = match[1];
    console.log("Found externalId:", channelId);

    // fetch its title
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId)}`;
    const rssRes = await fetch(url);
    const json = await rssRes.json();
    console.log("Title:", json.feed?.title);
  } else {
    console.log("Not found");
  }
}
run();
