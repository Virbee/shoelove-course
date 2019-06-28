const express = require("express");
const router = new express.Router();
const data = require("../bin/seeds");
const Product = require("../models/Product");
//importer data

///////AFFICHAGE DYNAMIQUE//////////
router.get(["/", "/home"], (req, res) => {
  res.render("index");
});

router.get(["/collection", "/kids", "/women", "/men"], (req, res) => {
  //suivant la terminaison de l'url
  const url = req.url;
  const urlSplit = url.split("/");
  const cat = urlSplit[1];
  if (cat === "collection") {
    Product.find()
      .then(product => res.render("products", { title: "whole", product }))
      .catch(err => console.log(err));
    return;
  }
  Product.find({ category: cat })
    .then(product => {
      res.render("products", { title: cat, product });
    })
    .catch(err => console.log(err));
});

//insertion des chaussures
function insertData(data) {
  Product.insertMany(data)
    .then(product => console.log(data))
    .catch(err => console.log(err));
}

insertData(data);
module.exports = router;
