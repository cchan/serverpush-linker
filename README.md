# serverpush-linker

Express middleware to automatically add Link: headers for upstream HTTP/2-supporting proxies to server-push.

## Background
HTTP/2 supports Server Push, a feature that allows the server to send assets it already knows will be useful to the HTML page alongside it in the first HTTP response.
Several implementations (Nginx, CloudFlare) will use Link: headers to inform fetching and sending of such Server Pushes.
This module provides an automatic way to server-push all assets.

## How to use
`npm install serverpush-linker`

Then add ```js
const spl = require('serverpush-linker')

app.use(spl())
``` before any handlers or middleware that might write any body content into the response.
