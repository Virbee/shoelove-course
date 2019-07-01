const express = require("express");
const router = new express.Router();
const Product = require("../models/Product");
const Tag = require("../models/Tag");
const authRoutes = require("../routes/auth-routes");
router.use(authRoutes);
const sizes = [
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44"
];

const categories = ["men", "women", "kids"];

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    console.log("SESSION TERMINATED");
    res.redirect("/");
  });
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

//////////////ADD A PRODUCT/////////////////

router.get("/prod-add", (req, res) => {
  res.render("products_add", { sizes, tag: Tag.label });
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

////////////ADD A TAG///////////////

router.post("/api/tag", (req, res) => {
  const { label } = req.body;
  Tag.create({
    label
  })
    .then(tag => res.send(tag.label))
    .catch();
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
    .then(product => {
      const checkedSizes = sizes.map(size => {
        return { size, checked: product.sizes.indexOf(size) >= 0 };
      });
      const selectedCategory = categories.map(cat => {
        return { cat, selected: product.category === cat };
      });
      res.render("product_edit", {
        product,
        sizes: checkedSizes,
        category: selectedCategory
      });
    })
    .catch(err => console.log(err));
});

router.post("/product-edit/:id", (req, res) => {
  console.log(req.body);
  const { name, ref, sizes, description, price, category } = req.body;
  if (!name || !ref || !sizes || !description || !price) {
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

////////////DELETE/////////////
///////////////////////////////

router.get("/delete/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/prod-manage").catch(err => console.log(err))
  );
});

module.exports = router;
