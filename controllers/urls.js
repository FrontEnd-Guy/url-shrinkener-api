/**
 * URL Controller: Handles URL-related operations.
 */

const mongoose = require('mongoose');
const shortId = require('shortid');
const Url = require('../models/Url.js');
const { InvalidError, NotFoundError } = require('../errors');

// Get list of URLs with optional pagination
module.exports.getUrls = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const urls = await Url.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const count = await Url.countDocuments();
    res.json({
      urls,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};

// Redirect to the full URL based on the slug
module.exports.redirectUrl = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const url = await Url.findOneAndUpdate(
      { $or: [{ slug }, { redirects: slug }] },
      { new: true }
    );

    if (!url) {
      return next(new NotFoundError('URL not found'));
    }

    res.redirect(url.fullUrl);
  } catch (error) {
    next(new Error('Internal server error'));
  }
};

// Add a new shortened URL
module.exports.addUrl = async (req, res, next) => {
  try {
    const { fullUrl, slug = shortId.generate() } = req.body;

    if (!fullUrl) {
      return next(new InvalidError('fullUrl is required'));
    }

    let url = await Url.findOne({ fullUrl, slug });
    if (!url) {
      // Ensure that the slug is unique
      const existingUrlWithSlug = await Url.findOne({ slug });
      if (existingUrlWithSlug) {
        return next(new InvalidError('This slug is already in use'));
      }

      url = await Url.create({ fullUrl, slug });
    }

    res.status(201).json(url);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new InvalidError('Invalid data'));
    }
    next(err);
  }
};

// Edit an existing shortened URL
module.exports.editUrl = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { newFullUrl, newSlug } = req.body;
    const url = await Url.findOne({ slug });

    if (!url) {
      return next(new NotFoundError('URL not found'));
    }

    if (newSlug && newSlug !== url.slug) {
      const isSlugInUse = await Url.findOne({
        $or: [{ slug: newSlug }, { redirects: newSlug }],
      });
      if (isSlugInUse) {
        return next(new InvalidError('This slug is already in use'));
      }

      if (!url.redirects.includes(url.slug)) {
        url.redirects.push(url.slug);
      }
      url.slug = newSlug;
    }

    if (newFullUrl) {
      url.fullUrl = newFullUrl;
    }

    await url.save();
    res.json(url);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new InvalidError('Invalid data'));
    }
    next(err);
  }
};

// Delete a shortened URL
module.exports.deleteUrl = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const url = await Url.findOne({ slug });

    if (!url) {
      return next(new NotFoundError('URL not found'));
    }

    await Url.deleteOne({ slug });
    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new InvalidError('Invalid slug'));
    }
    next(err);
  }
};
