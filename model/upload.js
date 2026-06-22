const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    message: String,
    image: String,
    title:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", PostSchema);