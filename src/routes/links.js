const express = require("express");
const router = express.Router();

// db connection reference
const pool = require("../database");

router.get("/add", (req, res) => {
  res.render("links/add");
});

router.post("/add", async (req, res) => {
  const { title, url, description } = req.body;

  const newLink = {
    title,
    url,
    description
  };
  console.log(newLink);
  
  await pool.query("INSERT INTO links set ?", [newLink]);
  res.redirect("/links");
});

router.get("/", async (req, res) => {

  const links = await pool.query('SELECT * FROM links');
 
  console.log(links);

  res.render("links/list", { links });
});

router.get("delete/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
});

module.exports = router;
