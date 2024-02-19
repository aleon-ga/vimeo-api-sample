const router = require('express')?.Router();
const vimeoRoutes = require('./vimeo');

// Vimeo routes
router.use('/vimeo', vimeoRoutes);

// Health check route
router.get('/health-check', (req, res) => {

    res.status(200).json({ ok: true });

});

module.exports = router;