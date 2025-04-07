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

  const payload = {
    id: realId,
    i: id,
    q: quality,
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
}
router.get("/:serverId", async (req, res) => {
  try {
    const { serverId } = req.params;
    const base64Id = decodeObfuscatedId(serverId);

    if (!base64Id) {
      return res.status(400).json({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Invalid serverId",
        ok: false,
        data: null,
        pagination: null,
      });
    }

    // Decode base64 ke JSON
    const decodedData = JSON.parse(Buffer.from(base64Id, "base64").toString("utf-8"));

    decodedData.nonce = "e8a21cbc8c";

    const form = new URLSearchParams();
    form.append("action", "2a3505c93b0035d3f455df82bf976b84");
    form.append("id", decodedData.id);
    form.append("i", decodedData.i);
    form.append("q", decodedData.q);
    form.append("nonce", decodedData.nonce);

    const response = await axios.post("https://otakudesu.cloud/wp-admin/admin-ajax.php", form, {
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
      return res.status(500).json({
        statusCode: 500,
        statusMessage: "Error",
        message: "Base64 player iframe not found",
        ok: false,
        data: null,
        pagination: null,
      });
    }

    const iframeHtml = Buffer.from(base64Data, "base64").toString("utf-8");
    const $ = cheerio.load(iframeHtml);
    const iframeSrc = $("iframe").attr("src");

    if (!iframeSrc || iframeSrc.trim() === "") {
      return res.status(200).json({
        statusCode: 200,
        statusMessage: "OK",
        message: "Video not available on this server",
        ok: true,
        data: {
          url: null,
          fallback: true,
          note: "Try another server or quality",
        },
        pagination: null,
      });
    }

    res.json({
      statusCode: 200,
      statusMessage: "OK",
      message: "",
      ok: true,
      data: { url: iframeSrc },
      pagination: null,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: err.message,
      ok: false,
      data: null,
      pagination: null,
    });
  }
});

module.exports = router;
