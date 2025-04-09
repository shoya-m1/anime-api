import axios from "axios";

let cachedNonce = null;
let lastFetched = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

async function getNonce() {
  const now = Date.now();

  if (cachedNonce && now - lastFetched < CACHE_DURATION) {
    return cachedNonce;
  }

  try {
    const form = new URLSearchParams();
    form.append("action", "aa1208d27f29ca340c92c66d1926f13f");

    const response = await axios.post("https://otakudesu.cloud/wp-admin/admin-ajax.php", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://otakudesu.cloud/",
        Origin: "https://otakudesu.cloud",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const nonce = response.data?.data;
    if (nonce && typeof nonce === "string") {
      cachedNonce = nonce;
      lastFetched = now;
      console.log("✅ Successfully fetched nonce:", nonce);
      return nonce;
    } else {
      console.error("❌ Nonce not found in response");
      return null;
    }
  } catch (error) {
    console.error("❌ Failed to fetch nonce:", error.message);
    return null;
  }
}

export default getNonce;
