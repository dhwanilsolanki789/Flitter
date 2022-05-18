import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import path from "path";
import Fleet from "./models/fleet.js";
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
	const allFleets = await Fleet.find({});
	res.render("fleets/fleet.ejs", { allFleets });
});

app.get("/fleets/new", (req, res) => {
	res.render("fleets/new.ejs");
});

app.get("/fleets/:id", async (req, res) => {
	const { id } = req.params;
	const theFleet = await Fleet.findById(id);
	const t12hr = t12(theFleet.time);
	res.render("fleets/details.ejs", { theFleet, t12hr });
});

app.get("/fleets/:id/edit", async (req, res) => {
	const { id } = req.params;
	const theFleet = await Fleet.findById(id);
	const t12hr = t12(theFleet.time);
	res.render("fleets/edit.ejs", { theFleet, t12hr });
});

app.get("/", (req, res) => {
	res.send("GREAT SUCCESS!");
});

app.post("/fleets", async (req, res) => {
	const { username, fleet, time } = req.body.fleet;
	const likes = getLikes();
	const newFleet = {
		username,
		fleet,
		time,
		likes,
	};
	await Fleet.insertMany([newFleet]);
	res.redirect("/fleets");
});

app.put("/fleets/:id", async (req, res) => {
	const { id } = req.params;
	await Fleet.findByIdAndUpdate(
		id,
		req.body.fleet,
		{ runValidators: true }
	);
	res.redirect(`/fleets/${id}`);
});

app.delete("/fleets/:id", async (req, res) => {
	const { id } = req.params;
	await Fleet.findByIdAndDelete(id);
	res.redirect("/fleets");
});

app.listen(3000, () => {
	console.log("Server Listening on 3000:");
});
