import mongoose from "mongoose";

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
		default: "00:00",
	},
	likes: {
		type: Number,
		min: 0,
		default: 0,
	},
});

const Fleet = mongoose.model("Fleet", fleetSchema);

export default Fleet;
