import Fleet from "./models/fleet.js";
import Comment from "./models/comment.js";
import fleetSchema from "./joiSchemas/joiFleet.js";
import commentSchema from "./joiSchemas/joiComment.js";

import { expressError } from "./utils/expressError.js";

const isLoggedIn = function(req,res,next) {
    if(!req.isAuthenticated()){
        req.flash('error',"You must be logged in");
        req.session.returnTo = req.originalUrl;
        return res.redirect("/auth/login");
    } else {
        next();
    }
}

const isAuthor = async function(req,res,next) {
    const { id } = req.params;
    const theFleet = await Fleet.findById(id);
    if(!theFleet){
		req.flash('error', "Couldnt find that fleet!");
		return res.redirect("/fleets");
	}

    if(!theFleet.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do that");
        return res.redirect(`/fleets/${id}`);
    }
    next();
}

const isCommentAuthor = async function(req,res,next) {
    const { id, cid } = req.params;
    const theComment = await Comment.findById(cid);
    if(!theComment.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do that");
        return res.redirect(`/fleets/${id}`);
    }
    next();
}

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

export { isLoggedIn, isAuthor, isCommentAuthor ,validateFleet, validateComment };