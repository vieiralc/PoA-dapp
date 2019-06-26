const express = require('express');
const router = express.Router();

const history = require('../products/history');

// @route GET /addHistory
// @desc renders historico.html
// @access Private
router.get('/addHistory', history.renderAddHistory);

// @route GET /listHistory
// @desc renders listaHistorico.html
// @access Private
router.get('/listHistory', history.renderGetHistory);

// @route POST /
// @desc registers a new history
// @access Private
router.post('/addHistory', history.addHistory);

// @route GET /getHistory
// @desc gets histories
// @access Private
router.get('/getHistory', history.getHistory);

module.exports = router;