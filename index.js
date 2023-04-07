const PORT = 3000;
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const app = express();

const numberOfEpisode = "";

const episode = `https://w1.anime4up.tv/episode/one-piece-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-${numberOfEpisode}/`;

axios(episode).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const links = [];

  $(".btn.btn-default", html).each(function () {
    const provider = $(this).text();
    const link = $(this).attr("href");
    links.push({
      provider,
      link,
    });
    console.log(links);
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
