const router = require("express").Router();
const route = router;

route.get("/", (req, res) => {
  res.send({
    method: req.method,
    message: "api anime otakudesu, detail dan episode anime saja. api asli https://wajik-anime-api.vercel.app/",
    endpoint: {
      detail_anime: "/anime/?q=arifureta-s3-sub-indo",
      episode_anime: "/episode/?q=arft-sss-s3-episode-4-sub-indo",
    },
  });
});

module.exports = router;