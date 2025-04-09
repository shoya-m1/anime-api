import axios from "axios";
import * as cheerio from "cheerio";
import { BaseUrl } from "../helpers/index.js";

const BASEURL = "https://otakudesu.cloud/anime/";

const animeDetail = async (animeId) => {
  const url = `${BaseUrl}/anime/${animeId}`;
  const { data } = await axios.get(url);
  // try {
  //   const { data } = await axios.get(url, {
  //     timeout: 20000,
  //     headers: {
  //       "User-Agent": "Mozilla/5.0",
  //     },
  //   });
  const $ = cheerio.load(data);

  const title = $('span:has(b:contains("Judul"))').text().replace("Judul: ", "").trim();
  const poster = $(".fotoanime img").attr("src");
  const japanese = $('span:has(b:contains("Japanese"))').text().replace("Japanese: ", "").trim();
  const score = $('span:has(b:contains("Skor"))').text().replace("Skor: ", "").trim();
  const producers = $('span:has(b:contains("Produser"))').text().replace("Produser: ", "").trim();
  const status = $('span:has(b:contains("Status"))').text().replace("Status: ", "").trim();
  const episodes = $('span:has(b:contains("Total Episode"))').text().replace("Total Episode: ", "").trim();
  const duration = $('span:has(b:contains("Durasi"))').text().replace("Durasi: ", "").trim();
  const aired = $('span:has(b:contains("Tanggal Rilis"))').text().replace("Tanggal Rilis: ", "").trim();
  const studios = $('span:has(b:contains("Studio"))').text().replace("Studio: ", "").trim();

  // Ekstraksi informasi batch
  const batchElement = $('a:contains("[BATCH] Subtitle Indonesia")');
  const batch = {
    title: batchElement.text().trim(),
    batchId: batchElement.attr("href").split("/").pop(),
    href: batchElement.attr("href"),
    otakudesuUrl: new URL(batchElement.attr("href"), BaseUrl).href,
  };

  // Ekstraksi sinopsis
  const synopsisParagraphs = [];
  $(".sinopc p").each((i, elem) => {
    synopsisParagraphs.push($(elem).text().trim());
  });
  const synopsis = {
    paragraphs: synopsisParagraphs,
  };

  // Ekstraksi genre
  const genreList = [];
  $('span:has(b:contains("Genre")) a').each((i, elem) => {
    const genreTitle = $(elem).text().trim();
    const genreHref = $(elem).attr("href");
    genreList.push({
      title: genreTitle,
      genreId: genreHref.split("/").filter(Boolean).pop(),
      href: genreHref,
      otakudesuUrl: new URL(genreHref, BaseUrl).href,
    });
  });

  // Ekstraksi daftar episode
  const episodeList = [];
  $(".episodelist ul li").each((i, elem) => {
    const anchor = $(elem).find("a[href*='/episode/']");
    if (!anchor.length) return; // skip jika tidak ada <a>

    const episodeTitle = anchor.text().trim();
    const episodeHref = anchor.attr("href");

    if (!episodeHref) return;

    const releaseDate = $(elem).find(".zeebr").text().trim();

    episodeList.push({
      title: episodeTitle,
      episodeId: episodeHref.split("/").filter(Boolean).pop(),
      href: episodeHref,
      otakudesuUrl: new URL(episodeHref, BaseUrl).href,
      releaseDate,
    });
  });

  return {
    title,
    poster,
    japanese,
    score,
    producers,
    status,
    episodes,
    duration,
    aired,
    studios,
    batch,
    synopsis,
    genreList,
    episodeList,
  };
  // } catch (error) {
  //   console.error("❌ Error saat ambil detail anime:", error.message);
  //   return { error: "Gagal mengambil detail anime" };
  // }
};

export default animeDetail;
