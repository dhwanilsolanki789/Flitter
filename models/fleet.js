import mongoose from "mongoose";
import Comment from "./comment.js";

const fleetSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		maxlength: 25,
	},
	text: {
		type: String,
		required: true,
	},
	time: {
		type: String,
	},
	likes: {
		type: Number,
		min: 0,
		default: 0,
	},
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Comment'	
		}
	]
});

fleetSchema.post('findOneAndDelete', async function(data) {
	if(data.comments.length){
		const res = await Comment.deleteMany({ _id : {$in : data.comments }});
		console.log(res);
	}
})

const Fleet = mongoose.model("Fleet", fleetSchema);

export default Fleet;
