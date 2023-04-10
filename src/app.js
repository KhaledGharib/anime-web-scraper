const PORT = 3000;
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const path = require("path");
const app = express();
const hbs = require("hbs");

const publicDirPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(publicDirPath));
//handlebars engine
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

let animeName = "";

app.get("/", (req, res) => {
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
        const title = $(this).find(".img-responsive").attr("alt");
        links.push({
          title,
          link,
          img,
        });
      });
      // res.send(links);
      const linkHTML = links.map((link) => {
        return {
          title: link.title.replace(/[:! ]/g, "-"),
          imgSrc: link.img,
          linkHref: link.link,
        };
      });

      res.render("index", { links: linkHTML, animeName });
    })
    .catch((error) => {
      res.status(500).send(error, "An error occurred");
    });
});

app.get("/episode", (req, res) => {
  const episode = req.query.episode || 1;

  const url = `https://w1.anime4up.tv/episode/${req.query.anime}-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-${episode}/`;

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
      const linkHTML = links.map((link) => {
        return {
          provider: link.provider,
          linkHref: link.link,
        };
      });
      res.render("episode", { links: linkHTML });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred");
    });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
