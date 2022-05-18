import mongoose from "mongoose";
import Fleet from "./models/fleet.js";

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
// 		time: "18:45",
// 		likes: 73774,
// 	},
// 	{
// 		username: "steveDetamble",
// 		text: "Guys, i think you should bring dms :)",
// 		time: "01:39",
// 		likes: 1105,
// 	},
// 	{
// 		username: "DevKothari",
// 		text: "Another shitty social media site..",
// 		time: "10:25",
// 		likes: 5480,
// 	},
// 	{
// 		username: "AndrewFC",
// 		text: "Andrew is the best SPIDERMAN no cap!!",
// 		time: "14:41",
// 		likes: 11345,
// 	},
// 	{
// 		username: "Kevinf",
// 		text: "SHUT the FUck upppppp",
// 		time: "06:47",
// 		likes: 32344,
// 	},
// 	{
// 		username: "Flitter",
// 		text: "@elonmusk this is not twitter please stfu!!",
// 		time: "22:37",
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

