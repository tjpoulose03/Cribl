const fs = require('fs')
const express = require('express')
const app = express()

app.get("/getLogs", async (req, res) => {
    var fileName = req.query.fileName
    var latestLogs = req.query.latestLogs
    var searchString = req.query.searchString
    console.log(fileName)
    console.log(latestLogs)
    console.log(searchString)
    var result
    try {
        result = await getLogs(latestLogs, fileName, searchString)
        console.log(result)
        console.log("Number of Lines : " + result['data'].length)

    } catch (err) {
        result = err
    }
    res.json(result)
})
async function getLogs(lastLinesLimit, filename, searchString) {
    const path = './var/log/' + filename
    const fileCheck = findFile(path) //Ensure File exists in before proceeding
    return new Promise((resolve, reject) => {
        if (fileCheck.data) {
            const fileSize = fs.statSync(path).size //Checking File Size to determine buffersize
            const bufferSize = Math.min(10000, fileSize) //For larger files take chunks of 10000 bytes otherwise take the entire file as a chunk 
            const readStream = fs.createReadStream(path, { highWaterMark: bufferSize }) //Create a read stream to read the file in chunks
            let Totallines = ''
            let lastLines
            readStream.on('data', (chunk) => {
                Totallines = Totallines.concat(chunk.toString()) //For every chunk concat it to the Total lines string for parsing later
            })
            readStream.on('end', () => {
                lastLines = getLastLines(Totallines.split(/\r?\n/), lastLinesLimit) //Once the file has been read, split the string into lines and get the required number of lines
                if (searchString)
                    lastLines = searchLogs(lastLines, searchString) //filter out the lines to get lines that only contain the searchString
                resolve({ message: 200, data: lastLines })
            })
        } else {
            resolve(fileCheck)
        }


    })
}

function getLastLines(lines, lastLinesLimit) {
    try {
        lines = lines.slice((lines.length) - lastLinesLimit, lines.length)
        return (lines)
    } catch (err) {
        return (err)
    }
}

function findFile(path) {
    try {
        if (fs.existsSync(path))
            return ({ message: "File Found", data: true })
        else
            return ({ message: "File Not Found", data: false, })
    }
    catch (err) {
        console.log(err)
        return ({ message: err, data: false, })
    }

}

function searchLogs(lastLines, searchString) {
    let filteredLastLines = []
    for (var i = 0; i < lastLines.length; i++) {
        if (lastLines[i].includes(searchString)) {
            console.log(lastLines[i])
            filteredLastLines.push(lastLines[i])
        }
    }
    return (filteredLastLines)
}

module.exports = app;