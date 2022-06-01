import express from "express";
import Fleet from "../models/fleet.js";
import Comment from "../models/comment.js";

import { catchAsync } from "../utils/catchAsync.js";
import { convertISt12, getLikes, } from "../utils/helper.js";
import { isLoggedIn, isCommentAuthor ,validateComment } from "../middleware.js";

const router = express.Router({mergeParams:true});

router.get("/:cid", isLoggedIn ,catchAsync(async (req,res) => {
	const { id, cid } = req.params;
	const theFleet = await Fleet.findById(id);
	const theComment = await Comment.findById(cid).populate('fleet');
	if(!theComment){
		req.flash('error',"Couldnt find that comment!");
		return res.redirect("/fleets");
	}
	res.render("comments/details.ejs", { theComment, theFleet });
}));

router.post("/", isLoggedIn ,validateComment ,catchAsync(async(req,res) => {
	const { id } = req.params;
	const theFleet = await Fleet.findById(id);
	req.body.comment.username = req.user.username;
	req.body.comment.likes = getLikes();
	const newComment = new Comment(req.body.comment);
	newComment.author = req.user;
	var d = new Date(Date.now());
	newComment.time = convertISt12(d.toString());
	theFleet.comments.push(newComment);
	newComment.fleet = theFleet;
	await theFleet.save();
	await newComment.save();
	req.flash('success', "Successfully added your comment");
	res.redirect(`/fleets/${id}`);
}));

router.delete("/:cid", isLoggedIn, isCommentAuthor ,catchAsync(async(req,res) => {
	const { cid, id } = req.params;
	await Fleet.findByIdAndUpdate(id,{$pull : {comments : cid}});
	await Comment.findByIdAndDelete(cid);
	req.flash('success', "Deleted your comment");
	res.redirect(`/fleets/${id}`); 
}));

export default router;