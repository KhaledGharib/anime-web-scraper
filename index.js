const PORT = 3000;
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const app = express();

const data = [];
app.get("/search", (req, res) => {
  const animeName = req.query.anime;
  const url = `https://w1.anime4up.tv/?search_param=animes&s=${animeName}`;

  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const links = [];

      $(".hover.ehover6", html).each(function () {
        const link = $(this).find("a").attr("href");
        const img = $(this).find(".img-responsive").attr("src");
        links.push({
          link,
          img,
        });
      });
      // console.log(links);
      const linkHTML = links.map((link) => {
        return `<img src="${link.img}"></img>
         <a href="${link.link}">click me</a>
         `;
      });
      const responseHTML = linkHTML.join("\n");
      res.send(responseHTML);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred");
    });
});

app.get("/episode", (req, res) => {
  const episode = req.query.episode || 0;
  const url = `https://w1.anime4up.tv/episode/one-piece-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-${episode}/`;

  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const links = [];

      $(".btn.btn-default", html).each(function () {
        const provider = $(this).text();
        const link = $(this).attr("href");
        links.push({
          provider,
          link,
        });
      });
      res.send(links);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred");
    });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
