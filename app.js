// import express (after npm install express)
const express = require('express');
var request = require('request');

// Cheerio implements a subset of core jQuery
const cheerio = require('cheerio');

// Importing the module 'url'
const url = require('url');

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8080;

app.use(express.json())
// create a route for the app
app.get('/', (req, res) => {
  res.send('Hello World');
});

const getMetaTag = ($, name) =>  {
  return(
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="og:${name}"]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content') ||
    $(`meta[property=${name}]`).attr('content') ||
    $(`meta[property="og:${name}"]`).attr('content') ||
    $(`meta[property="twitter:${name}"]`).attr('content')
  );
}

app.post('/get-preview', async (req, res) => {
  console.log(req.body)
  const { previewUrl, id } = req.body;
  console.log(previewUrl);
  console.log(id);
  request(previewUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        const html = body // Print the google web page.
        const $ = cheerio.load(html);
  	console.log($('h1').text())
  	const metaTagData = {
  	  success: true,
	  id:id,
	  url: previewUrl,
	  domain: url.parse(previewUrl).hostname,
	  title: getMetaTag($, 'title') || $(`h1`).text(),
	  img: getMetaTag($, 'image') || './images/no-image.png',
	  description: getMetaTag($, 'description') || $(`p`).text(),
	}
	res.json(metaTagData)
     } else {
     	res.json({success: false, message: "Some error occurred"})
     }
  })
});


// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
