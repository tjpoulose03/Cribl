const express = require('express')
const app = express()
const port = 4000
app.listen(port, () => {
    console.log("The server is running on port " + port)
})
const logging = require("./routes/logging")
app.use('/', logging)

