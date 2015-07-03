'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/tutorial', require('./tutorial'));
router.use('/members', require('./members'));
router.use('/circles', require('./circles'));
router.use('/users', require('./users'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});