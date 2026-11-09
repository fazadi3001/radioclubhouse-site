/* Radio Clubhouse — Iran-friendly site config
 * To change ONLY the Clubhouse room link: edit CLUBHOUSE_ROOM_URL below
 * (same value also in room.json → "url"). No HTML change needed.
 */
window.RC_CONFIG = {
  /* Room name shown above the now-playing title */
  ROOM_NAME: "نبرد اندیشه ها",
  /* Ordered fallbacks. Prefer low-bitrate public HTTPS MP3 when available. */
  STREAMS: [
    { url: "", type: "mp3", label: "MP3 اصلی" },          /* PLACEHOLDER: fixed public HTTPS MP3 */
    { url: "", type: "mp3", label: "MP3 کم‌حجم ۶۴k" },     /* PLACEHOLDER: 64 kbps mirror */
    { url: "https://clubhouse-mini.tail4a3417.ts.net/hls/master.m3u8", type: "hls", label: "HLS (خارج از ایران / VPN)" }
  ],
  /* now playing: {title} — existing radio.py /meta.json */
  META_URL: "https://clubhouse-mini.tail4a3417.ts.net/meta.json",
  /* === Clubhouse room: UPDATE THIS when the room link changes === */
  CLUBHOUSE_ROOM_URL: "https://www.clubhouse.com/i/%DA%AF%D9%88%DB%8C%D8%A7-%D9%85%D8%B0%D8%A7%DA%A9%D8%B1%D8%A7%D8%AA-%D8%A8%D9%87-%D8%A8%D9%86-%D8%A8%D8%B3%D8%AA-%D8%A7%D8%B3%D8%A7%D8%B3%DB%8C-%D8%AE%D9%88%D8%B1%D8%AF%D9%87-%D9%88%D8%A7%D9%82%D8%B9%D8%A7-%DA%86%D8%B1%D8%A7/AammeZaY",
  /* Live room: radio.py on the mini via Tailscale Funnel (free; often needs VPN inside Iran).
     stage  <- LIVE_BASE/meta.json   {title, stage:[{name,mod,speaking}]}
     chat   <- LIVE_BASE/chat?since=N {ok,last,m:[{id,n,t}]} */
  LIVE_BASE: "https://clubhouse-mini.tail4a3417.ts.net",
  ROOM_LIVE_POLL_SEC: 10,
  /* Listener chat → room. EMPTY = message box hidden (no server; code dormant). */
  CHAT_POST_URL: "",
  CHAT_MAX_LEN: 200,
  ARCHIVE_URL: "archive.json",
  TELEGRAM_URL: ""  /* PLACEHOLDER e.g. https://t.me/yourchannel */
};
