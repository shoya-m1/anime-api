import * as parser from "../parser/index.js";
import { BaseUrl, errorHandler} from "../helpers/index.js";
import axios from "axios";
import * as cheerio from "cheerio";

export const defaultPage = (req, res) => {
  return res.json({
    source: BaseUrl,
    author: "wajik45",
    message: "Ngopiiii.. ☕",
    alert: "kemungkinan masih ada bug",
    routes: {
      home: "/home",
      anime: "/anime",
      movie: "/movie",
      ongoing: "/ongoing",
      completed: "/completed",
      genreList: "/genre",
      genre: "/genre/:slug",
      search: "/search?query",
      animeDetails: "/anime/:slug",
      streamingAnime: "/anime/:slug/:episode",
      streamingMovie: "/movie/:slug",
      more: "https://github.com/wajik45/wajik-anime-api",
    },
  });
};

export const getAnimeDetail = async (req, res) => {
  const { animeId } = req.params;

  try {
    const data = await parser.animeDetail(animeId);
    res.status(200).json(data);
  } catch (error) {
    const err = errorHandler(error);
    res.status(500).json(err);
  }
};

export const getEpisodeDetail = async (req, res) => {
  const { episodeId } = req.params;

  try {
    const data = await parser.episodeDetail(episodeId);
    res.status(200).json(data);
  } catch (error) {
    const err = errorHandler(error);
    res.status(500).json(err);
  }
};

export const getServers = async (req, res) => {
  try {
    const { serverId } = req.params;
    const base64Id = parser.servers(serverId);

    if (!base64Id) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid serverId",
        ok: false,
        data: null,
      });
    }

    const decodedData = JSON.parse(Buffer.from(base64Id, "base64").toString("utf-8"));
    const nonce = await parser.getNonce();
    if (!nonce) {
      return res.status(500).json({
        statusCode: 500,
        message: "Failed to fetch nonce",
        ok: false,
        data: null,
      });
    }
    decodedData.nonce = nonce;

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
};
