import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        maxlength: 25
    },
    text : {
        type : String,
        required : true
    },
    time : {
        type : String,
        default: "00:00",
    },
    likes : {
        type : Number,
        min : 0,
        default : 0
    },
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fleet: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Fleet'
    }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;