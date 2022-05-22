import express from "express";
import Fleet from "../models/fleet.js";
import fleetSchema from "../joiSchemas/joiFleet.js";

import { expressError } from "../utils/expressError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { convertISt12, getLikes, } from "../utils/helper.js";

const router = express.Router();

const validateFleet = (req,res,next) => {
	const { error } = fleetSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new expressError(msg,400);
	} else {
		next();
	}
}

router.get("/", catchAsync(async (req, res) => {
	const allFleets = await Fleet.find({});
	res.render("fleets/fleet.ejs", { allFleets });
}));

router.get("/new", (req, res) => {
	res.render("fleets/new.ejs");
});

router.get("/:id", catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const theFleet = await Fleet.findById(id).populate("comments");
		if(!theFleet)
			throw new expressError("Fleet not found!!",404);
		res.render("fleets/details.ejs", { theFleet });
}));

router.get("/:id/edit", catchAsync(async (req, res) => {
	const { id } = req.params;
	const theFleet = await Fleet.findById(id);
	if(!theFleet)
		throw new expressError("Fleet not found!!",404);
	res.render("fleets/edit.ejs", { theFleet });
}));

router.post("/", validateFleet ,catchAsync(async (req, res) => {
	req.body.fleet.likes = getLikes();
	const newFleet = new Fleet(req.body.fleet);
	var d = new Date(Date.now());
	newFleet.time = convertISt12(d.toString());
	await newFleet.save();
	res.redirect("/fleets");
}));

router.put("/:id", validateFleet,catchAsync(async (req, res) => {
	const { id } = req.params;
	await Fleet.findByIdAndUpdate(
		id,
		req.body.fleet,
		{ runValidators: true }
	);
	res.redirect(`/fleets/${id}`);
}));

router.delete("/:id", catchAsync(async (req, res) => {
	const { id } = req.params;
	await Fleet.findByIdAndDelete(id);
	res.redirect("/fleets");
}));

export default router;