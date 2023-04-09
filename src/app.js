const PORT = 3000;
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const path = require("path");
const app = express();
const hbs = require("hbs");

const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//handlebars engine
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("index");
});

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

      const linkHTML = links.map((link) => {
        return {
          imgSrc: link.img,
          linkHref: link.link,
        };
      });

      res.render("search", { links: linkHTML });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred");
    });
});

app.get("/episode", (req, res) => {
  const episode = req.query.episode || 0;
  const animeName = "conan";
  const url = `https://w1.anime4up.tv/episode/${animeName}-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-${episode}/`;

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
