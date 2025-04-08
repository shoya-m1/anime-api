const axios = require("axios");
const cheerio = require("cheerio");
const { obfuscateServerId } = require("../utils/obfuscate");

const BASE_URL = "https://otakudesu.cloud";

async function scrapeEpisodePage(episodeId) {
  const url = `${BASE_URL}/episode/${episodeId}/`;
  try {
    const { data } = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    const $ = cheerio.load(html);

    const title = $("h1").text().trim();
    const animeId = $('.flir a[href*="/anime/"]').attr("href")?.split("/anime/")[1]?.replace(/\/$/, "");

    const urlId = episodeId;

    // Streaming servers
    const server = { qualities: [] };

    $(".mirrorstream ul").each((i, elem) => {
      const $ul = $(elem);

      const qualityLabel = $ul.clone().children("li").remove().end().text().trim();
      const match = qualityLabel.match(/(\d{3,4}p)/i);
      const qualityTitle = match ? match[1] : null;

      if (!qualityTitle) return;

      const serverList = [];

      $ul.find("li a").each((j, el) => {
        const serverTitle = $(el).text().trim();
        const rawData = $(el).attr("data-content");

        if (rawData) {
          try {
            const serverId = obfuscateServerId(rawData);
            serverList.push({
              title: serverTitle,
              serverId,
              href: `/otakudesu/server/${serverId}`,
            });
          } catch (err) {
            console.warn("Failed to parse serverId:", {
              rawData,
              error: err.message,
            });
          }
        }
      });
      if (serverList.length > 0) {
        server.qualities.push({
          title: qualityTitle,
          serverList,
        });
      }
    });

    // Default streaming URL
    const defaultBase64 = $(".mirrorstream").first().find("li a").first().attr("data-content");

    let defaultStreamingUrl = null;
    if (defaultBase64) {
      const parsed = JSON.parse(Buffer.from(defaultBase64, "base64").toString());

      const formData = new URLSearchParams({
        action: "aa1208d27f29ca340c92c66d1926f13f",
        id: parsed.id,
        i: parsed.i,
        q: parsed.q,
        nonce: "YOUR_NONCE_HERE",
      });

      const postRes = await axios.post(`${BASE_URL}/wp-admin/admin-ajax.php`, formData);
      const iframeHtml = Buffer.from(postRes.data.data, "base64").toString();
      const iframeSrc = cheerio.load(iframeHtml)("iframe").attr("src");
      defaultStreamingUrl = iframeSrc || null;
    }

    // Download links
    const downloadUrl = { qualities: [] };

    $("ul li").each((i, el) => {
      const qualityTitle = $(el).find("strong").text().trim(); // e.g. 360p
      const urls = [];
      let size = "";

      $(el)
        .children("a")
        .each((j, aTag) => {
          const urlTitle = $(aTag).text().trim();
          const urlHref = $(aTag).attr("href");
          if (urlTitle && urlHref) {
            urls.push({
              title: urlTitle,
              url: urlHref,
            });
          }
        });

      const sizeText = $(el).find("i").last().text().trim();
      if (sizeText) {
        size = sizeText;
      }

      if (qualityTitle && urls.length > 0) {
        downloadUrl.qualities.push({
          title: qualityTitle,
          size,
          urls,
        });
      }
    });
    // next prev episode
    const prevNextData = {
      hasPrevEpisode: false,
      prevEpisode: null,
      hasNextEpisode: false,
      nextEpisode: null,
    };

    $(".flir a").each((i, el) => {
      const href = $(el).attr("href");
      const titleAttr = $(el).attr("title")?.toLowerCase();

      if (href && titleAttr) {
        const episodeId = href.split("/").filter(Boolean).pop(); // ambil terakhir dari URL
        const relativeHref = `/otakudesu/episode/${episodeId}`;
        const episodeObj = {
          title: titleAttr.includes("sebelumnya") ? "Prev" : "Next",
          episodeId,
          href: relativeHref,
          otakudesuUrl: href,
        };

        if (titleAttr.includes("sebelumnya")) {
          prevNextData.hasPrevEpisode = true;
          prevNextData.prevEpisode = episodeObj;
        } else if (titleAttr.includes("selanjutnya")) {
          prevNextData.hasNextEpisode = true;
          prevNextData.nextEpisode = episodeObj;
        }
      }
    });

    return {
      title,
      animeId,
      urlId,
      defaultStreamingUrl,
      prevNextData,
      server,
      downloadUrl,
    };
  } catch (error) {
    console.error("❌ Gagal mengambil data episode:", error.message);
    return { error: "Gagal mengambil data episode" };
  }
}

module.exports = { scrapeEpisodePage };
