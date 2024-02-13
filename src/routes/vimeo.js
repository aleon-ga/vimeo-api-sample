const router = require('express')?.Router();
const { uploadTextTracks } = require('../controllers/vimeo');

// Vimeo routes
router.post('/vimeo/text-tracks', uploadTextTracks);

// Health check route
router.get('/health-check', (req, res) => {

    res.status(200).json({ message: 'Alive!' });

});

module.exports = router;