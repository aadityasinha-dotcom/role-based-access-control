// app/routes/blog.routes.js
const { Router } = require('express');
const router = Router();
const blogCtrl = require('../controllers/blog.controller');

// Public: list and read
router.get('/', blogCtrl.findAll);
router.get('/:id', blogCtrl.findOne);

// Protected: create, update, delete (only logged-in users)
router.post('/', blogCtrl.create);
router.put('/:id', blogCtrl.update);
router.delete('/:id', blogCtrl.delete);

module.exports = router;

