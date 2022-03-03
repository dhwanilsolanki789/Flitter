import mongoose from "mongoose";
import Tweet from "./models/tweet.js";

mongoose
	.connect("mongodb://localhost:27017/flitter")
	.then(() => {
		console.log("Mongo Connection open:");
	})
	.catch((err) => {
		console.log("Lmao mongo noob!!");
		console.log(err);
	});

/* const testfleet = new Tweet({
	username: "dhwanilsolanki789",
	tweet: "Checking my flitter status",
});

testfleet
	.save()
	.then((res) => {
		console.log(res);
	})
	.catch((e) => {
		console.log("saving problem!!");
		console.log(e);
	}); */

const data = [
	{
		username: "paineAlice",
		tweet: "Done with my first fleet <3",
		time: "18:45",
		likes: 73774,
	},
	{
		username: "steveDetamble",
		tweet: "Guys, i think you should bring dms :)",
		time: "01:39",
		likes: 1105,
	},
	{
		username: "DevKothari",
		tweet: "Another shitty social media site..",
		time: "10:25",
		likes: 5480,
	},
	{
		username: "AndrewFC",
		tweet: "Andrew is the best SPIDERMAN no cap!!",
		time: "14:41",
		likes: 11345,
	},
	{
		username: "Kevinf",
		tweet: "SHUT the FUck upppppp",
		time: "06:47",
		likes: 32344,
	},
	{
		username: "Flitter",
		tweet: "@elonmusk this is not twitter please stfu!!",
		time: "22:37",
		likes: 99287,
	},
];
Tweet.insertMany(data)
	.then((res) => {
		console.log(res);
	})
	.catch((e) => {
		console.log("Couldnt insert :((");
		console.log(e);
	});