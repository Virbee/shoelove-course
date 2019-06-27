const express = require("express");
const router = new express.Router();
const Product = require("../models/Product");

//////////////ADD A PRODUCT/////////////////

router.get("/prod-add", (req, res) => {
  res.render("products_add");
});

router.post("/prod-add", (req, res) => {
  const { name, ref, sizes, description, price, category } = req.body;
  if (!name || !ref || !sizes || !description || !price || !category) {
    res.render("product_edit", { error: "Invalid input" });
    return;
  }
  Product.create({
    name,
    ref,
    sizes,
    description,
    price,
    category
  })
    .then(() => res.redirect("/collection"))
    .catch(err => console.log(err));
});

/////////MANAGE////////////
///////////////////////////

router.get("/prod-manage", (req, res) => {
  Product.find()
    .then(products => res.render("products_manage", { products }))
    .catch(err => console.log(err));
});

/////////UPDATE/////////////
////////////////////////////

router.get("/product-edit/:id", (req, res) => {
  Product.findById(req.params.id)
    .then(product => res.render("product_edit", { product }))
    .catch(err => console.log(err));
});

router.post("/product-edit/:id", (req, res) => {
  const { name, ref, sizes, description, price, category } = req.body;
  if (!name || !ref || !sizes || !description || !price || !category) {
    res.render("product_edit", { error: "Invalid input" });
    return;
  }
  Product.updateOne(
    { _id: req.params.id },
    {
      name,
      ref,
      sizes,
      description,
      price,
      category
    }
  )
    .then(() => res.redirect("/collection"))
    .catch(err => console.log(err));
});

router.get("/delete/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id).then(product =>
    res.redirect("/prod-manage").catch(err => console.log(err))
  );
});

module.exports = router;
