const fs = require('fs')
const express = require('express')
const app = express()

app.get("/checking", async (req, res) => {
    var result
    try {
        result = await getUpdatedLastLines(7, 'log1.txt')
    } catch (err) {
        result = err
    }
    res.json(result)
})
async function getUpdatedLastLines(lastLinesLimit, filename) {
    return new Promise((resolve, reject) => {
        const path = './var/log/' + filename
        const fileSize = fs.statSync(path).size
        const bufferSize = Math.min(2000, fileSize)
        const readStream = fs.createReadStream(path, { start: fileSize - bufferSize, end: fileSize })
        let lines = []
        readStream.on('data', (chunk) => {
            let something = chunk.toString().split('\n')
            lines = lines.concat(something)
            if (lines.length >= lastLinesLimit) {
                try {
                    lines = lines.slice((lines.length) - lastLinesLimit, lines.length)
                    console.log(lines)
                    resolve(lines)
                } catch (err) {
                    reject(err)
                }
            }
        })
    })

}
module.exports = app;