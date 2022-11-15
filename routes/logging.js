const fs = require('fs')
const express = require('express')
const app = express()

app.get("/getLogs", async (req, res) => {
    var fileName = req.query.fileName
    var latestLogs = req.query.latestLogs
    var searchString = req.query.searchString
    if (isPositiveInteger(latestLogs) || latestLogs == '' || !latestLogs) { //Checking to see if the latestLogs paramter is valid
        var result
        try {
            result = await getLogs(latestLogs, fileName, searchString)
        } catch (err) {
            result = err
        }
        res.json(result)
    } else {
        res.send({ message: "Invalid latestLogs Value" }) //Invalid latestLogs values
    }

})

//NEW METHOD
async function getLogs(lastLinesLimit, filename, searchString) {
    const path = './var/log/' + filename
    const fileCheck = findFile(path, filename) //Ensure File exists in log folder before proceeding
    return new Promise(async (resolve, reject) => {
        if (fileCheck.data) {
            const fileSize = fs.statSync(path).size //Check the size of the file to determine the buffer size
            const bufferSize = Math.min(10000, fileSize) //For larger files take chunks of 10000 bytes otherwise take the entire file as a chunk
            let end = fileSize - 1  //We will start reading from the end of the file as chunks 
            let start = end - bufferSize // We are reading the file in chunks of bufferSize until the number of lines is met
            let totalChunks = '' //This will contain the all the chunks we convert to string
            if (!lastLinesLimit || start == -1) { //If no lastlines were specified the bufferSize ends up being the filesize, return entire file
                totalChunks = await readEntireFile(totalChunks, path)
                let orderedList = getLastLines(totalChunks.split(/\r?\n/), lastLinesLimit)
                if (searchString)
                    orderedList = searchLogs(orderedList, searchString) //filter out the lines to get lines that only contain the searchString
                resolve({ message: "Success", data: orderedList })
            } else {
                while ((totalChunks.split(/\r?\n/).length) < lastLinesLimit) { //Keep reading the file from the bottom up until the number of lines is reached
                    totalChunks = await readAnotherChunk(totalChunks, start, end, path)
                    end = start - 1 //change the range of the file pointer to read the next section
                    start = start - bufferSize
                    if (start < 0) //If we have gone too far then just set the start of the file to 0
                        start = 0
                    if (end < 0) //If the end of the file has gone too far we know we have reached the top of the file so theres nothing left to read, exit the loop
                        break
                }
                let orderedList = getLastLines(totalChunks.split(/\r?\n/), lastLinesLimit) //order the lines and get only the lines that are needed
                if (searchString)
                    orderedList = searchLogs(orderedList, searchString) //filter out the lines to get lines that only contain the searchString
                resolve({ message: "Success", data: orderedList })
            }
        } else {
            resolve(fileCheck) //Return file does not exist
        }
    })
}
async function readAnotherChunk(totalChunks, start, end, path) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path, { start: start, end: end })
        readStream.on('data', (chunk) => {
            totalChunks = chunk.toString() + totalChunks
        })
        readStream.on('end', () => {
            resolve(totalChunks)
        })
    })

}
async function readEntireFile(totalChunks, path) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path)
        readStream.on('data', (chunk) => {
            totalChunks = totalChunks.concat(chunk.toString())
        })
        readStream.on('end', () => {
            resolve(totalChunks)
        })
    })
}


function getLastLines(lines, lastLinesLimit) {
    try {
        if (lastLinesLimit > lines.length || !lastLinesLimit) // If more lines than the file can provide is specified then just send all the lines
            lastLinesLimit = lines.length
        let orderedLines = []
        for (var i = lines.length - 1; i >= lines.length - lastLinesLimit; i--) {// We are reading from the end of the file and keeping track of the number of lines
            orderedLines.push(lines[i]) // We are pushing the lines in chronological order in this array
        }
        return (orderedLines)
    } catch (err) {
        return (err)
    }
}

function findFile(path, fileName) {
    try {
        if (fs.existsSync(path) && fileName != '')
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
        if (lastLines[i].includes(searchString)) { // For each lines requested, check whether the searchstring exits or not
            filteredLastLines.push(lastLines[i]) // Push the lines that contain the searchString to this array and return it
        }
    }
    return (filteredLastLines)
}
function isPositiveInteger(x) {
    const num = Number(x)
    if (Number.isInteger(num) && num >= 0) { //Checking to see whether the lastLines value is a postive integer more than or equal to 0
        return true
    } else {
        return false
    }
}

//OLD METHOD
// async function getLogs(lastLinesLimit, filename, searchString) {
//     const path = './var/log/' + filename
//     const fileCheck = findFile(path, filename) //Ensure File exists in log folder before proceeding
//     return new Promise((resolve, reject) => {
//         if (fileCheck.data) {
//             const fileSize = fs.statSync(path).size //Checking File Size to determine buffersize
//             const bufferSize = Math.min(10000, fileSize) //For larger files take chunks of 10000 bytes otherwise take the entire file as a chunk 
//             const readStream = fs.createReadStream(path, { highWaterMark: bufferSize }) //Create a read stream to read the file in chunks
//             let Totallines = ''
//             let lastLines
//             readStream.on('data', (chunk) => {
//                 Totallines = Totallines.concat(chunk.toString()) //For every chunk concat it to the Total lines string for parsing later
//             })
//             readStream.on('end', () => {
//                 lastLines = getLastLines(Totallines.split(/\r?\n/), lastLinesLimit) //Once the file has been read, split the string into lines and get the required number of lines
//                 if (searchString)
//                     lastLines = searchLogs(lastLines, searchString) //filter out the lines to get lines that only contain the searchString
//                 resolve({ message: "Success", data: lastLines })
//             })
//         } else {
//             resolve(fileCheck)
//         }
//     })
// }



module.exports = app