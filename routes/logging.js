const fs = require('fs')
const express = require('express')
const app = express()
const readline = require('readline')

app.get("/checking", async (req, res) => {
    var result
    try {
        result = await getLogs(23, 'log1.txt')
        console.log(result)
        console.log("Number of Lines : " + result.length)

    } catch (err) {
        result = err
    }
    res.json(result)
})
function getLastLines(lines, lastLinesLimit) {
    try {
        lines = lines.slice((lines.length) - lastLinesLimit, lines.length)
        return (lines)
    } catch (err) {
        return (err)
    }
}
// async function getUpdatedLastLines(lastLinesLimit, filename) {
//     return new Promise((resolve, reject) => {
//         const path = './var/log/' + filename
//         const fileSize = fs.statSync(path).size
//         const bufferSize = Math.min(10000, fileSize)
//         const readStream = fs.createReadStream(path, { highWaterMark: bufferSize })
//         let incompleteLine = false
//         let Totallines = []
//         let lastLines
//         readStream.on('data', (chunk) => {
//             console.log("Chunk")
//             console.log(chunk.toString())
//             console.log("________________________")
//             if ((chunk.toString().charAt((chunk.toString()).length - 1)) !== '\n') {
//                 console.log("FOUND INCOMLETE LINE")
//                 let chunkString = chunk.toString()
//                 console.log(chunkString.charAt(chunkString.length - 1))
//             }
//             let chunkArray = chunk.toString().split('\n')
//             // if (incompleteLine) {
//             //     chunkArray[0] = chunkArray[0].concat(Totallines[Totallines.length - 1])
//             //     Totallines.pop()
//             //     incompleteLine = false
//             // }
//             Totallines = Totallines.concat(chunkArray)
//         })
//         readStream.on('end', () => {
//             lastLines = getLastLines(Totallines, lastLinesLimit)
//             resolve(lastLines)
//         })

//     })
// }
async function getLogs(lastLinesLimit, filename) {
    return new Promise((resolve, reject) => {
        let TotalLines = []
        const path = './var/log/' + filename
        const rl = readline.createInterface({
            input: fs.createReadStream(path)
        })
        rl.on('line', (line) => {
            TotalLines.push(line)
        }).on('close', () => {
            resolve(getLastLines(TotalLines, lastLinesLimit))
        })
    })
}
async function searchLogs() {

}
async function doesFileExist() {

}

module.exports = app;