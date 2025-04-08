const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

function decodeObfuscatedId(serverId) {
  const parts = serverId.split("-");
  if (parts.length !== 3) return null;

  const id = parseInt(parts[1], 10);
  const quality = parts[2];
  const realId = parseInt(parts[0], 16);

  const payload = { id: realId, i: id, q: quality };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

router.get("/:serverId", async (req, res) => {
  try {
    const { serverId } = req.params;
    const base64Id = decodeObfuscatedId(serverId);

    if (!base64Id) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid serverId",
        ok: false,
        data: null,
      });
    }

    const decodedData = JSON.parse(Buffer.from(base64Id, "base64").toString("utf-8"));
    decodedData.nonce = "e8a21cbc8c";

    const form = new URLSearchParams();
    form.append("action", "2a3505c93b0035d3f455df82bf976b84");
    form.append("id", decodedData.id);
    form.append("i", decodedData.i);
    form.append("q", decodedData.q);
    form.append("nonce", decodedData.nonce);

    const response = await axios.post("https://otakudesu.cloud/wp-admin/admin-ajax.php", form, {
      timeout: 8000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://otakudesu.cloud/",
        Origin: "https://otakudesu.cloud",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const base64Data = response.data?.data;
    if (!base64Data) {
      return res.status(502).json({
        statusCode: 502,
        message: "No iframe data returned",
        ok: false,
        data: null,
      });
    }

    const iframeHtml = Buffer.from(base64Data, "base64").toString("utf-8");
    const $ = cheerio.load(iframeHtml);
    const iframeSrc = $("iframe").attr("src");

    if (!iframeSrc || iframeSrc.trim() === "") {
      return res.status(200).json({
        statusCode: 200,
        message: "Video not available on this server",
        ok: true,
        data: {
          url: null,
          fallback: true,
          note: "Try another server or quality",
        },
      });
    }

    res.json({
      statusCode: 200,
      message: "Success",
      ok: true,
      data: { url: iframeSrc },
    });
  } catch (err) {
    console.error("❌ Error /server/:serverId:", err.message);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error: " + err.message,
      ok: false,
      data: null,
    });
  }
});

module.exports = router;
