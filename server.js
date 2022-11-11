const express = require('express')
const app = express()
const port = 4000; //Change to your port of choice here
app.listen(port, () => {
    console.log("The server is running on port " + port)
})
const logging = require("./routes/logging")
app.use('/', logging)

