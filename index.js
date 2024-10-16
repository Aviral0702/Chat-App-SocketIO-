const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
app.use(express.static("./public"));
app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
})

server.listen(9000,()=>{
    console.log("Server is running on port 9000")
})