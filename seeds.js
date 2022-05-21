import mongoose from "mongoose";
import Fleet from "./models/fleet.js";
import Comment from "./models/comment.js";

mongoose
	.connect("mongodb://localhost:27017/flitter")
	.then(() => {
		console.log("Mongo Connection open:");
	})
	.catch((err) => {
		console.log("Lmao mongo noob!!");
		console.log(err);
	});

// Check by seeding single data object

/* const testfleet = new Tweet({
	username: "dhwanilsolanki789",
	text: "Checking my flitter status",
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

//Seed multiple data in the database

//  const data = [
// 	{
// 		username: "paineAlice",
// 		text: "Done with my first fleet <3",
// 		time: "06:45 PM",
// 		likes: 73774,
// 	},
// 	//{
// 	//	username: "steveDetamble",
// 	//	text: "Guys, i think you should bring dms :)",
// 	//	time: "01:39 AM",
// 	//	likes: 1105,
// 	//},
// 	{
// 		username: "DevKothari",
// 		text: "Another shitty social media site..",
// 		time: "10:25 AM",
// 		likes: 5480,
// 	},
// 	{
// 		username: "AndrewFC",
// 		text: "Andrew is the best SPIDERMAN no cap!!",
// 		time: "02:41 PM",
// 		likes: 11345,
// 	},
// 	{
// 		username: "Kevinf",
// 		text: "SHUT the FUck upppppp",
// 		time: "06:47 AM",
// 		likes: 32344,
// 	},
// 	{
// 		username: "Flitter",
// 		text: "@elonmusk this is not twitter please stfu!!",
// 		time: "10:37 PM",
// 		likes: 99287,
// 	},
// ];

// await Fleet.deleteMany({});
// Fleet.insertMany(data)
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((e) => {
// 		console.log("Couldnt insert :((");
// 		console.log(e);
// 	});