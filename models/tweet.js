import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		maxlength: 25,
	},
	tweet: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		default: "00:00",
	},
	likes: {
		type: Number,
		min: 0,
		default: 0,
	},
});

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
