/**
 * URL Routes: Defines the routes for URL operations.
 */

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlRegex, slugRegex } = require('../utils/constants');

const {getUrls, redirectUrl, addUrl, deleteUrl, editUrl } = require("../controllers/urls");

router.get('/', getUrls);
router.get('/:slug', celebrate({
  params: Joi.object().keys({
    slug: Joi.string().required(),
  })}), redirectUrl);
router.post('/',   celebrate({
  body: Joi.object().keys({
    fullUrl: Joi.string()
      .required()
      .pattern(urlRegex),
    slug: Joi.string()
  }),
}), addUrl);
router.patch('/:slug', celebrate({
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
  body: Joi.object().keys({
    newFullUrl: Joi.string().required().pattern(urlRegex),
    newSlug: Joi.string().required().pattern(slugRegex).max(10),
  }),
}), editUrl);

router.delete('/:slug', celebrate({
  params: Joi.object().keys({
    slug: Joi.string().required(),
  })}), deleteUrl);

module.exports = router;
