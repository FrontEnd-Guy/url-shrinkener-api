/**
 * URL Model: Defines the schema for URL data.
 */

const mongoose = require('mongoose');
const shortId = require('shortid');

const urlSchema = new mongoose.Schema({
  fullUrl: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, default: shortId.generate },
  redirects: [{ type: String}]
});

module.exports = mongoose.model('Url', urlSchema);
