const mongoose = require("mongoose");
//const Tag = require("./Tag");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  img: {
    type: String,
    required: true,
    default: "/medias/img/shoe.png"
  },
  name: { type: String, required: true },
  ref: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  sizes: {
    type: [String],
    enum: [
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
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ["women", "kids", "men"]
  },
  price: { type: Number, required: true },
  id_tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
