var express = require("express");
var cors = require("cors");
var path = require("path");
require("dotenv").config({ path: "./config.env" });

const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db("fullstack-lessons");

async function connectToMongoDB() {
	try {
		await client.connect();
		console.log("MongoDB connection done");
		return client;
	} catch (err) {
		console.dir(err);
	}
}

async function collectionExists(name) {
	const collections = await db.listCollections({ name: name }).toArray();
	return collections.length > 0;
}

connectToMongoDB();

var app = express();
const PORT = 3000;

app.set("json spaces", 2);
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

app.get("/lessons", async function (request, response) {
	try {
		if (!(await collectionExists("lessons"))) {
			return response.status(404).json({ error: "Lessons collection is not available in the database" });
		}
		let collection = db.collection("lessons");
		let results = await collection.find({}).toArray();
		response.send(results);
	} catch (err) {
		console.error(err);
		response.status(500).json({ error: "Failed to load lessons from the server" });
	}
});

app.post("/orders", async function (request, response) {
	try {
		if (!(await collectionExists("orders"))) {
			return response.status(404).json({ error: "Orders collection is not available in the database" });
		}
		var body = request.body;
		let collection = db.collection("orders");
		let result = await collection.insertOne(body);
		response.send(result);
	} catch (err) {
		console.error(err);
		response.status(500).json({ error: "Failed to save order to the server" });
	}
});

app.put("/lessons/:_id", async function (request, response) {
	var body = request.body;
	let collection = db.collection("lessons");
	let requestId = request.params._id;
	try {
		if (!(await collectionExists("lessons"))) {
			return response.status(404).json({ error: "Lessons collection is not available in the database" });
		}
		if (!ObjectId.isValid(requestId)) {
			return response.status(400).json({ error: "Invalid lesson ID" });
		}

		const query = { _id: new ObjectId(requestId) };
		const updates = {
			$set: body,
		};
		let result = await collection.updateOne(query, updates);
		if (result.matchedCount === 0) {
			return response.status(404).json({ error: "Lesson not found" });
		}
		response.send(result);
		console.log(result);
	} catch (err) {
		console.error(err);
		response.status(500).json({ error: "Failed to update lesson" });
	}
});

app.use(function (request, response) {
	response.status(404).json({ error: "Route " + request.url + " is not available" });
});

app.listen(PORT, function () {
	console.log("App is live at", PORT);
});
