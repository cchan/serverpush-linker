const express = require('express')
const app = express()
const spl = require("../index")
const port = 4231
const http = require('http')


app.use(spl())
app.get('/', (req, res) => res.send(`
<script src = "asdf.js"></script>
<link rel="stylesheet" href="asdf.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js" integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>
<link  rel ="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossorigin="anonymous" />
`))
app.get('/test/test.html', (req, res) => {
    res.write(`
        <script src = "bundle.js"></script>
        <script src = "/bund`)
    res.write(`le2.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js" integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>
        <link  rel="stylesheet" href="style.css">
        <link rel = "stylesh`)
    setTimeout(()=>{
        res.write(`eet" href="/style2.css" />
            <link  rel ="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossorigin="anonymous" />`)
        res.end()
    }, 1000)
})

let server = app.listen(port, () => {
    let done = 0
    http.request(`http://localhost:${port}/`, (res) => {
        let ANSWER = "<asdf.js>;as=script;rel=preload, <asdf.css>;as=style;rel=preload, <https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js>;as=script;rel=preload, <https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css>;as=style;rel=preload"
        if(res.statusCode != 200)
            throw new Error(`Wrong status code: ${res.statusCode}`)
        if(res.headers.link != ANSWER)
            throw new Error(`Wrong link header: ${res.headers.link} vs ${ANSWER}`)
        done += 1
        if(done == 2) server.close()
    }).on('error', e=>{throw e}).end()
    http.request(`http://localhost:${port}/test/test.html`, (res) => {
        let ANSWER = "<bundle.js>;as=script;rel=preload, </bundle2.js>;as=script;rel=preload, <https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js>;as=script;rel=preload, <style.css>;as=style;rel=preload, </style2.css>;as=style;rel=preload, <https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css>;as=style;rel=preload"
        if(res.statusCode != 200)
            throw new Error(`Wrong status code: ${res.statusCode}`)
        if(res.headers.link != ANSWER)
            throw new Error(`Wrong link header: ${res.headers.link} vs ${ANSWER}`)
        done += 1
        if(done == 2) server.close()
    }).on('error', e=>{throw e}).end()
})
