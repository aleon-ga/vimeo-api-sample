const nodeFetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { VIMEO_API_BASE_URL } = require('../constants');
const { VIMEO_PERSONAL_ACCESS_TOKEN } = process.env;

const uploadTextTracks = async (req, res) => {

    const failures = [], successes = [];

    try {

        const videos = req.body.videos || [];

        if (videos.length === 0) {

            res.status(400).json({ message: 'No video IDs found.' });

            return;

        };

        await Promise.all(videos.map(async (video) => {

            const { id, languages } = video;

            let url, options, response;

            url = `${VIMEO_API_BASE_URL}/videos/${id}/texttracks`;

            options = {
                headers: {
                    Authorization: `Bearer ${VIMEO_PERSONAL_ACCESS_TOKEN}`,
                    Accept: 'application/vnd.vimeo.*+json;version=3.4'
                }
            };

            //TODO: Step 1: get all the text tracks of a video.
            response = await nodeFetch(url, options);

            if (!response.ok) {

                console.error(`Failed to retrieve all the text tracks of the video ${id}`);

                failures.push(id);

                return;

            };

            const { data } = await response.json();

            if (data.length === 0) {

                console.error(`The video ${id} has no text tracks.`);

                failures.push(id);

                return;

            };

            const { link: captionsDownloadUrl, name: captionsName } = data.find(caption => caption.name === 'auto_generated_captions.vtt');

            //TODO: Step 2: download the auto generated captions locally.
            response = await nodeFetch(captionsDownloadUrl, options);

            if (!response.ok) {

                console.error(`Failed to download the auto generated captions file of the video ${id}`);

                failures.push(id);

                return;

            };

            const filePath = path.join(__dirname, '..', 'downloads', captionsName);

            const stream = fs.createWriteStream(filePath);

            response.body.pipe(stream);

            // Promise to handle waiting until the file is downloaded or encounters an error before proceeding.
            const streamPromise = new Promise((resolve) => {

                stream.on('finish', () => {

                    console.log(`Auto generated captions file of the video ${id} written successfully`);

                    resolve(true);
    
                });
    
                stream.on('error', (error) => {
    
                    console.error(`Failed to write the auto generated captions file of the video ${id} locally`, error);

                    resolve(false);
                    
                });

            });

            const isWriteStreamSuccess = await streamPromise;

            if (!isWriteStreamSuccess) {

                failures.push(id);

                return;

            } else {

                successes.push(id); //! TEMPORAL

            }

            //*************************************************************************/
            //************************** TRADUCCIONES *********************************/
            //*************************************************************************/

            // options = {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         type: 'captions',
            //         language: 'es', //! DINÁMICO
            //         name: 'español' //! DINÁMICO
            //       }),
            //     headers: {
            //         Authorization: `Bearer ${VIMEO_PERSONAL_ACCESS_TOKEN}`,
            //         'Content-Type': 'application/json',
            //         Accept: 'application/vnd.vimeo.*+json;version=3.4'
            //     }
            // };

            /**
             * TODO: Step 3: get the upload link for the text track.
             * To get the upload link for the text track, you must first create the text track's resource, which is like a container to hold the track.
             */
            // response = await nodeFetch(url, options);

            // if (!response.ok) {

            //     res.status(response.status).json({ message: "Failed to create the text track's resource." });

            //     return;

            // };

            // const { link } = await response.json();

            /**
             * TODO: Step 4: upload the text track.
             * To upload the text track, take the value of the link field from Step 3, and make a PUT request to this location.
             */
            // const filePath = path.join(__dirname, '..', 'downloads', 'auto_generated_captions.vtt');

            // const vttFileContent = fs.readFileSync(filePath, 'utf8');

            // options = {
            //     method: 'PUT',
            //     body: vttFileContent,
            //     headers: { Accept: 'application/vnd.vimeo.*+json;version=3.4' }
            // };

            // response = await nodeFetch(link, options);

            // if (response.status !== 200) {

            //     res.status(response.status).json({ message: 'Failed to upload the text track.' });

            //     return;

            // };

            // res.status(response.status).json({ message: 'Text track upload successful.' });

        }));

        if (successes.length > 0 && failures.length === 0) {

            res.status(200).json({ message: 'All videos have been successfully updated.' });

        } else if (successes.length > 0 && failures.length > 0) {

            res.status(200).json({
                successes: successes.join(', '),
                failures: failures.join(', ')
            });

        } else if (successes.length === 0 && failures.length > 0) {

            throw new Error(`Failed to update all the videos.`);

        };

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: error.message });

        return;

    };

};

module.exports = { uploadTextTracks };