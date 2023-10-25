const express = require('express');
const { exec } = require('child_process');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/proxy', (req, res) => {
    const targetURL = 'https://www.tradingview.com/chart/i8hOgkM4/?symbol=OANDA%3AXAUUSD';

    // Use curl to fetch content from the external website
    exec(`curl -L ${targetURL}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send('Error fetching the content');
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        const croppedContent = cropContent(stdout); // Call a function to crop the content
        res.send(croppedContent);
    });
});

// Function to crop content based on pixel values
function cropContent(html) {
    const $ = cheerio.load(html);

    // Apply CSS styles to hide or truncate content based on pixel values
    // For example, to hide the top 100 pixels, bottom 50 pixels,
    // left 30 pixels, and right 20 pixels of content:
    $('body').css({
        'margin-top': '-50px',
        'margin-bottom': '-500px',
        'margin-left': '-55px',
        'margin-right': '10px'
    });

    // Return the modified HTML
    return $.html();
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});