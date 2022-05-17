import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import path from "path";
import Tweet from "./models/tweet.js";
import { t12, getLikes } from "./functions/time.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose
	.connect("mongodb://localhost:27017/flitter")
	.then(() => {
		console.log("Mongo Connection open:");
	})
	.catch((err) => {
		console.log("Lmao mongo noob!!");
		console.log(err);
	});

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/fleets", async (req, res) => {
	const allTweets = await Tweet.find({});
	res.render("tweets/tweet.ejs", { allTweets });
});

app.get("/fleets/new", (req, res) => {
	res.render("tweets/new.ejs");
});

app.get("/fleets/:id", async (req, res) => {
	const { id } = req.params;
	const theTweet = await Tweet.findById(id);
	const t12hr = t12(theTweet.time);
	res.render("tweets/details.ejs", { theTweet, t12hr });
});

app.get("/fleets/:id/edit", async (req, res) => {
	const { id } = req.params;
	const theTweet = await Tweet.findById(id);
	const t12hr = t12(theTweet.time);
	res.render("tweets/edit.ejs", { theTweet, t12hr });
});

app.get("/", (req, res) => {
	res.send("GREAT SUCCESS!");
});

app.post("/fleets", async (req, res) => {
	const { username, tweet, time } = req.body;
	const likes = getLikes();
	const newTweet = {
		username,
		tweet,
		time,
		likes,
	};
	await Tweet.insertMany([newTweet]);
	res.redirect("/fleets");
});

app.put("/fleets/:id", async (req, res) => {
	const { id } = req.params;
	const { username, tweet, time } = req.body;
	await Tweet.findByIdAndUpdate(
		id,
		{ username, tweet, time },
		{ runValidators: true }
	);
	res.redirect(`/fleets/${id}`);
});

app.delete("/fleets/:id", async (req, res) => {
	const { id } = req.params;
	await Tweet.findByIdAndDelete(id);
	res.redirect("/fleets");
});

app.listen(3000, () => {
	console.log("Server Listening on 3000:");
});
