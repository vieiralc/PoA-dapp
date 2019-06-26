const express = require('express');
const router = express.Router();

const stages = require('../products/stages');

// @route GET /addStages
// @desc renders stages.html
// @access Private
router.get('/addStage', stages.renderAddStage);

// @route GET /getStages
// @desc renders listaEtapas.html
// @access Private
router.get('/getStages', stages.renderGetStages);

// @route GET /listStages
// @desc gets all stages
// @access Private
router.get('/listStages', stages.listStages);

// @route POST /addStage
// @desc registers a new stage
// @access Private
router.post('/addStage', stages.addStage);

module.exports = router;