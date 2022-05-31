import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password,12);
        next();
    } catch(e) {
        console.log(e);
        next(e);
    }
})

const User = mongoose.model('User',userSchema);

export default User;