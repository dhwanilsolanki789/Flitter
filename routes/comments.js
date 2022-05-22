import express from "express";
import Fleet from "../models/fleet.js";
import Comment from "../models/comment.js";
import commentSchema from "../joiSchemas/joiComment.js";

import { expressError } from "../utils/expressError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { convertISt12, getLikes, } from "../utils/helper.js";

const router = express.Router({mergeParams:true});

const validateComment = (req,res,next) => {
	const { error } = commentSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new expressError(msg,400);
	} else {
		next();
	}
}

router.get("/:cid", catchAsync(async (req,res) => {
	const { id, cid } = req.params;
	const theFleet = await Fleet.findById(id);
	const theComment = await Comment.findById(cid).populate('fleet');
	if(!theComment)
		throw new expressError("Comment not found!",404);
	res.render("comments/details.ejs", { theComment, theFleet });
}));

router.post("/", validateComment ,catchAsync(async(req,res) => {
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

router.delete("/:cid", catchAsync(async(req,res) => {
	const { cid, id } = req.params;
	await Fleet.findByIdAndUpdate(id,{$pull : {comments : cid}})
	await Comment.findByIdAndDelete(cid);
	res.redirect(`/fleets/${id}`); 
}));

export default router;