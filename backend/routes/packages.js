const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

router.get('/search', packageController.searchPackages);
router.get('/popular', packageController.getPopularPackages);
router.get('/:id', packageController.getPackageById);

module.exports = router;
