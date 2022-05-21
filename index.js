import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import path from "path";
import Fleet from "./models/fleet.js";
import Comment from "./models/comment.js";
import Joi from "joi";
import fleetSchema from "./joiSchemas/joiFleet.js";
import commentSchema from "./joiSchemas/joiComment.js";
import { expressError } from "./utils/expressError.js";
import { catchAsync } from "./utils/catchAsync.js";
import { convertISt12, getLikes, } from "./utils/helper.js";

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

const validateFleet = (req,res,next) => {
	const { error } = fleetSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new expressError(msg,400);
	} else {
		next();
	}
}

const validateComment = (req,res,next) => {
	const { error } = commentSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new expressError(msg,400);
	} else {
		next();
	}
}

app.get("/fleets", catchAsync(async (req, res) => {
	const allFleets = await Fleet.find({});
	res.render("fleets/fleet.ejs", { allFleets });
}));

app.get("/fleets/new", (req, res) => {
	res.render("fleets/new.ejs");
});

app.get("/fleets/:id", catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const theFleet = await Fleet.findById(id).populate("comments");
		if(!theFleet)
			throw new expressError("Fleet not found!!",404);
		res.render("fleets/details.ejs", { theFleet });
}));

app.get("/fleets/:id/edit", catchAsync(async (req, res) => {
	const { id } = req.params;
	const theFleet = await Fleet.findById(id);
	if(!theFleet)
		throw new expressError("Fleet not found!!",404);
	res.render("fleets/edit.ejs", { theFleet });
}));

app.get("/fleets/:id/comments/:cid", catchAsync(async (req,res) => {
	const { id, cid } = req.params;
	const theFleet = await Fleet.findById(id);
	const theComment = await Comment.findById(cid).populate('fleet');
	if(!theComment)
		throw new expressError("Comment not found!",404);
	res.render("comments/details.ejs", { theComment, theFleet });
}))

app.get("/", (req, res) => {
	res.send("GREAT SUCCESS!");
});

app.post("/fleets", validateFleet ,catchAsync(async (req, res) => {
	req.body.fleet.likes = getLikes();
	const newFleet = new Fleet(req.body.fleet);
	var d = new Date(Date.now());
	newFleet.time = convertISt12(d.toString());
	await newFleet.save();
	res.redirect("/fleets");
}));

app.post("/fleets/:id/comments", validateComment ,catchAsync(async(req,res) => {
	const { id } = req.params;
	const theFleet = await Fleet.findById(id);
	req.body.comment.likes = getLikes();
	const newComment = new Comment(req.body.comment);
	var d = new Date(Date.now());
	newComment.time = convertISt12(d.toString());
	theFleet.comments.push(newComment);
	newComment.fleet = theFleet;
	await theFleet.save();
	await newComment.save();
	res.redirect(`/fleets/${id}`);
}));

app.put("/fleets/:id", validateFleet,catchAsync(async (req, res) => {
	const { id } = req.params;
	await Fleet.findByIdAndUpdate(
		id,
		req.body.fleet,
		{ runValidators: true }
	);
	res.redirect(`/fleets/${id}`);
}));

app.delete("/fleets/:id", catchAsync(async (req, res) => {
	const { id } = req.params;
	await Fleet.findByIdAndDelete(id);
	res.redirect("/fleets");
}));

app.delete("/fleets/:id/comments/:cid", catchAsync(async(req,res) => {
	const { cid, id } = req.params;
	await Fleet.findByIdAndUpdate(id,{$pull : {comments : cid}})
	await Comment.findByIdAndDelete(cid);
	res.redirect(`/fleets/${id}`); 
}))

app.all('*',(req,res,next) => {
	next(new expressError("Page not found!",404));	
})

app.use((err,req,res,next) => {
	//console.dir(err);
	const { statusCode = 500} = err;
	if(!err.message)
		err.message = "Something went wrong!";
	res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
	console.log("Server Listening on 3000:");
});
