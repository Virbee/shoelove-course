const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  label: { type: String, unique: true }
});

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;
