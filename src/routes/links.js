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
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash("success", "Link Saved Successfully");
  res.send("received");
});

router.get("/", async (req, res) => {
  const links = await pool.query("SELECT * FROM links");
  res.send("links/list", { links });
});

router.get("delete/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash("success", "Link Removed Successfully");
});

module.exports = router;
