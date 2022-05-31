import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import userSchema from "../joiSchemas/joiUser.js";

import { expressError } from "../utils/expressError.js";

const JWT_KEY = "flitterAuth";

passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    User.findOne({ username }).then(user => {
        if (!user) {
            return done(null, false, { message: 'You are not registered!' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);        
            } else {
                return done(null, false, { message: 'Password incorrect! Please try again.' });
            }
        });
    });
}));

const router = express.Router();

const validateUser = (req,res,next) => {
    const { error } = userSchema.validate(req.body);
    if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new expressError(msg,400);
	} else {
		next();
	}
}

router.get('/register', (req,res) => {
    res.render('auth/register.ejs');
})

router.get('/activate/:token', (req,res,next) => {
    const { token } = req.params;
    if(token){
        jwt.verify(token,JWT_KEY, (err, decodedToken) => {
            if(err){
                console.log(err);
                req.flash('error', "Expired link, try again!");
                return res.redirect("/auth/register.ejs");
            } else {
                const { name, username, email, password } = decodedToken;
                User.findOne({email:email}).then(user => {
                    if(user){
                        res.flash('error',"Email already in use");
                        return res.redirect("/auth/register.ejs");
                    } else {
                        const newUser = new User({ name, username, email, password});
                        newUser.save().then(user => {
                            req.flash('success',"Account activated");
                            res.redirect("/auth/login");
                        }).catch(e => {
                            console.log(e);
                            next(e);
                        });
                    }
                })
            }
        })
    } else {
        req.flash('error',"Error activating account");
        res.redirect("/auth/register");
    }
})

router.get('/login', (req,res) => {
    res.render('auth/login.ejs');
})

router.get('/forgot', (req,res) => {
    res.render("auth/forgot.ejs");
})

router.get('/reset/:id', (req,res) => {
    const { id } = req.params;
    res.render("auth/reset.ejs", { id });
})

router.post('/register', validateUser , (req,res) => {
    const { name, username, email, password, password2 } = req.body;
    var errors = [];

    if(password !== password2){
        errors.push({msg : "Passwords dont match"});
    }

    if(password.length < 8){
        errors.push({msg : "Password must be at least 8 characters long"});
    }

    if(errors.length) {
        res.render("auth/register.ejs", { errors ,name, username, email });
    } else {
        User.findOne({email:email}).then(user => {
            if(user){
                req.flash('error',"Email id is already registered");
                return res.redirect("/auth/register");
            } else {
                const token = jwt.sign({ name, username, email, password}, JWT_KEY, {expiresIn: "30m"});
                const CLIENT_URL = "http://" + req.headers.host;
                const output = `
                <h2>Please click on the below link to activate your flitter account</h2>
                <p>${CLIENT_URL}/auth/activate/${token}</p>
                <p><b>NOTE:</b>The link expires in 30 minutes</p>
                `;
    
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user:"dummymailauth@gmail.com",
                        pass:"Authmailsend2022"
                    }
                });
    
                const mailOptions = {
                    from: '"Auth Admin" <dummymailauth@gmail.com>',
                    to: email,
                    subject: "Account verification | Flitter",
                    html: output,
                };
    
                transporter.sendMail(mailOptions, (err,inf) => {
                    if(err){
                        console.log(err);
                        req.flash('error',"Error sending activation mail");
                        return res.redirect("/auth/register");
                    } else {
                        console.log("Mail sent: %s", inf.response);
                        req.flash('success',"Activation mail sent");
                        res.redirect("/auth/login");
                    }
                })
            }
        })
    }  
})

router.post('/forgot', (req,res) => {
    const { email } = req.body;
    User.findOne({email}).then(theUser => {
        if(!theUser){
            req.flash('error',"User with email doesnt exist");
            return res.redirect("/auth/forgot");
        } else {
            const token = jwt.sign({ id : theUser._id }, JWT_KEY , {expiresIn: "30m"});
            const CLIENT_URL = "http://" + req.headers.host;
            const output = `
            <h2>Please click on the below link to reset your account password</h2>
            <p>${CLIENT_URL}/auth/forgot/${token}</p>
            <p><b>NOTE:</b> The reset link expires in 30 minutes.</p>
            `;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "dummymailauth@gmail.com",
                    pass: "Authmailsend2022"
                }
            });

            const mailOptions = {
                from: '"Auth Admin" <dummymailauth@gmail.com>',
                to: email,
                subject: "Reset password | Flitter",
                html: output
            };

            transporter.sendMail(mailOptions, (err,inf) => {
                if(err){
                    console.log(err);
                    req.flash('error',"Error sending reset mail");
                    return res.redirect("/auth/forgot");
                } else {
                    console.log("Mail sent: %s", inf.response);
                    req.flash('success',"Reset password mail sent!");
                    res.redirect("/auth/login");
                }
            })
        }
    })
})

router.get('/forgot/:token', (req,res) => {
    const { token } = req.params;
    if(token) {
        jwt.verify(token,JWT_KEY,(err,decodedToken) => {
            if(err){
                console.log(err);
                req.flash('error',"Expired link, try again!");
                res.redirect("/auth/forgot");
            } else {
                const { id } = decodedToken;
                User.findById(id).then(theUser => {
                    if(!theUser){
                        req.flash('error',"User with email doesnt exist");
                        return res.redirect("/auth/forgot");
                    } else {
                        res.redirect(`/auth/reset/${id}`);
                    }
                })
            }
        })
    } else {
        req.flash('error',"Password reset failed");
        return res.redirect("/auth/forgot");
    }
})


router.post('/reset/:id', (req,res,next) => {
    const { id } = req.params;
    const { password, password2 } = req.body;
    var errors = [];

    if(password !== password2) {
        errors.push({ msg : "Passwords dont match"});
    }

    if(password.length < 8) {
        errors.push({ msg : "Password must be atleast 8 characters long"})
    }

    if(errors.length){
        res.render(`auth/reset.ejs`, {errors, id});
    } else {
        User.findById(id).then(theUser => {
            if(!theUser){
                req.flash('error',"User with email doesnt exist");
                return res.redirect("/auth/forgot");
            } else {
                theUser.password = password;
                theUser.save().then(user => {
                    req.flash('success',"Password reset successfully");
                    return res.redirect("/auth/login");
                }).catch(e => {
                    console.log(e);
                    next(e);
                })
            }
        })
    } 
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req,res) => {
    req.flash('success',`Welcome to Flitter, ${req.user.username}`);
    res.redirect("/fleets");
})

router.get('/logout', (req,res,next) => {
    req.logout(err => {
        console.log(err);
        return next(err);
    });
    req.flash('success',"Successfully logged you out!");
    res.redirect("/auth/login");
})

export default router;