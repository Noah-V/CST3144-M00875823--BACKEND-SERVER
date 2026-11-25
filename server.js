var express = require("express");
var cors = require("cors");
var path = require("path");
var app = express();

app.set("json spaces", 2);

const PORT = 3000;

const arrayOfLessons = [
	{
		id: 1001,
		subject: "Computer Science",
		location: "Mauritius",
		price: "2,000",
		imageProps: {
			path: "images/example-class.jpg",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1002,
		subject: "Mathematics",
		location: "Mauritius",
		price: "1,000",
		imageProps: {
			path: "images/class2.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1003,
		subject: "Law",
		location: "Mauritius",
		price: "3,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1004,
		subject: "Agriculture",
		location: "Hendon",
		price: "13,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1005,
		subject: "Cyber Security",
		location: "Dubai",
		price: "9,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1006,
		subject: "Philosophy",
		location: "Port Louis",
		price: "30,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1007,
		subject: "British History",
		location: "UK",
		price: "500",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1008,
		subject: "Branding",
		location: "Mauritius",
		price: "34,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1009,
		subject: "AI and Machine Learning",
		location: "Hendon",
		price: "35,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
	{
		id: 1010,
		subject: "Computer Science",
		location: "Mauritius",
		price: "4,000",
		imageProps: {
			path: "images/class3.png",
			alt: "Picture of classroom",
		},
		availability: 5,
	},
];

app.use(cors());
app.use(express.json());

app.use(function (request, response, next) {
	console.log("[" + new Date().toLocaleString() + "] Incoming " + request.method + " request to " + request.url);
	next();
});

var imagesPath = path.resolve(__dirname, "images");
app.use("/images", express.static(imagesPath));

app.use("/images", function (request, response) {
	response.status(404).json({ error: "Image " + request.url + " does not exist" });
});

app.get("/lessons", function (request, response) {
	response.json(arrayOfLessons);
});

app.post("/orders", function (request, response) {
	const order = request.body;
	console.log("New order from " + order.firstName + " " + order.lastName);
	console.log("Telephone: " + order.telephone);
	console.log("Lesson IDs: " + order.lessonIDs.join(", "));
	console.log("Number of spaces: " + order.spaces);
	response.json({ message: "Order received for " + order.firstName + " " + order.lastName });
});

app.use(function (request, response) {
	response.status(404).send("404 - Page Not Found!");
});

app.listen(PORT, console.log("App is live at ", PORT));
