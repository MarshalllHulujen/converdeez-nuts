const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Wait why are you here?');
});

// Function to sanitize a string for use as a filename
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9-_]/g, ''); // Replace invalid characters
}

app.get('/download', async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const videoInfo = await ytdl.getInfo(videoUrl);

    // Find a format that includes both video and audio streams
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestvideo', filter: 'audioandvideo' });

    if (!format) {
      return res.status(400).send('No suitable format found for audio and video.');
    }

    const videoTitle = videoInfo.videoDetails.title;
    const sanitizedTitle = sanitizeFilename(videoTitle);

    res.header('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);
    ytdl(videoUrl, { format }).pipe(res);
  } catch (error) {
    res.status(500).send('Error converting video.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
