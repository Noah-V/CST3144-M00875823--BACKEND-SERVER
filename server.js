var express = require("express");
var app = express();
const PORT = 3000;

app.use(function (request, response) {
	console.log("Incoming request", request.url);
	response.end("Hello world");
});

app.listen(PORT, console.log("App is live at ", PORT));
