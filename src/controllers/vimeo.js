const nodeFetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { VIMEO_API_BASE_URL } = require('../constants');
const { VIMEO_PERSONAL_ACCESS_TOKEN } = process.env;

const uploadTextTracks = async (req, res) => {

    try {

        const videos = req.body.videos || [];

        if (videos.length === 0) {

            res.status(400).json({ message: 'No video IDs found.' });

            return;

        };

        for (const id of videos) {

            let url, options, response, data;

            // Step 1: get the URI of the text track
            url = `${VIMEO_API_BASE_URL}/videos/${id}`;

            options = {
                headers: {
                    Authorization: `Bearer ${VIMEO_PERSONAL_ACCESS_TOKEN}`,
                    Accept: 'application/vnd.vimeo.*+json;version=3.4'
                }
            };

            response = await nodeFetch(url, options);

            if (!response.ok) {

                res.status(response.status).json({ message: "Failed to obtain the text track's URI." });

                return;

            };

            data = await response.json();

            const textTrackUri = data.metadata.connections.texttracks.uri || '';

            /**
             * Step 2: get the upload link for the text track.
             * To get the upload link for the text track, you must first create the text track's resource, which is like a container to hold the track.
             */
            url = `${VIMEO_API_BASE_URL}/${textTrackUri}`;

            options = {
                method: 'POST',
                body: JSON.stringify({
                    type: 'captions',
                    language: 'es', //! DINÁMICO
                    name: 'español' //! DINÁMICO
                  }),
                headers: {
                    Authorization: `Bearer ${VIMEO_PERSONAL_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.vimeo.*+json;version=3.4'
                }
            };

            response = await nodeFetch(url, options);

            if (response.status !== 201) {

                res.status(response.status).json({ message: "Failed to create the text track's resource." });

                return;

            };

            data = await response.json();

            const uploadLink = data.link || '';

            /**
             * Step 3: upload the text track.
             * To upload the text track, take the value of the link field from Step 2, and make a PUT request to this location.
             */
            url = uploadLink;

            const filePath = path.join(__dirname, '..', 'downloads', 'auto_generated_captions.vtt');

            const vttFileContent = fs.readFileSync(filePath, 'utf8');

            options = {
                method: 'PUT',
                body: vttFileContent,
                headers: { Accept: 'application/vnd.vimeo.*+json;version=3.4' }
            };

            response = await nodeFetch(url, options);

            if (response.status !== 200) {

                res.status(response.status).json({ message: 'Failed to upload the text track.' });

                return;

            };

            res.status(response.status).json({ message: 'Text track upload successful.' });

        };

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: error.message });

        return;

    };

};

module.exports = { uploadTextTracks };