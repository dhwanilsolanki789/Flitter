import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/tweets", async (req, res) => {
	const allTweets = await Tweet.find({});
	res.render("tweets/tweet.ejs", { allTweets });
});

app.get("/tweets/new", (req, res) => {
	res.render("tweets/new.ejs");
});

app.get("/tweets/:id", async (req, res) => {
	const { id } = req.params;
	const theTweet = await Tweet.findById(id);
	const t12hr = t12(theTweet.time);
	res.render("tweets/details.ejs", { theTweet, t12hr });
});

app.get("/tweets/:id/edit", async (req, res) => {
	const { id } = req.params;
	const theTweet = await Tweet.findById(id);
	const t12hr = t12(theTweet.time);
	res.render("tweets/edit.ejs", { theTweet, t12hr });
});

app.get("/", (req, res) => {
	res.send("GREAT SUCCESS!");
});

app.post("/tweets", async (req, res) => {
	const { username, tweet, time } = req.body;
	const likes = getLikes();
	const newTweet = {
		username,
		tweet,
		time,
		likes,
	};
	await Tweet.insertMany([newTweet]);
	res.redirect("/tweets");
});

app.put("/tweets/:id", async (req, res) => {
	const { id } = req.params;
	const { username, tweet, time } = req.body;
	await Tweet.findByIdAndUpdate(
		id,
		{ username, tweet, time },
		{ runValidators: true }
	);
	res.redirect(`/tweets/${id}`);
});

app.delete("/tweets/:id", async (req, res) => {
	const { id } = req.params;
	await Tweet.findByIdAndDelete(id);
	res.redirect("/tweets");
});

app.listen(3000, () => {
	console.log("Server Listening on 3000:");
});
