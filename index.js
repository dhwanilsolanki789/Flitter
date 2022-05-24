import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import { expressError } from "./utils/expressError.js";

import fleetRoutes from "./routes/fleets.js"
import commentRoutes from "./routes/comments.js"

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
app.use(express.static(path.join(__dirname,"/public")));

const sessionConfigs = {
	secret: "worsthash",
	resave: false,
	saveUninitialized: true 
}
app.use(session(sessionConfigs));
app.use(flash());

app.use((req,res,next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

app.use('/fleets',fleetRoutes);
app.use('/fleets/:id/comments',commentRoutes);

app.get("/", (req, res) => {
	res.send("GREAT SUCCESS!");
});

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