const express = require('express');
const router = express.Router();
const { getAnimeDetails } = require('../scrapers/animeDetail');

router.get('/:animeId', async (req, res) => {
  const { animeId } = req.params;
  try {
    const animeData = await getAnimeDetails(animeId);
    res.json({
      statusCode: 200,
      statusMessage: 'OK',
      message: '',
      ok: true,
      data: animeData,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message,
      ok: false,
      data: null,
    });
  }
});

module.exports = router;
