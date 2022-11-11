import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    _id: Number,
    date: Date,
    hour: Date,
    body: String,
    createdBy: Number,
    Shared: Number,
    images: {
        url: String,
        title: String,
    },
    likes: Number,
    hashtags: [String],
    comments: [{
        text: String,
        commentedBy: Number,
        date: Date,
        hour: Date
    }]
},{
    collection: "CERI"
});

export default mongoose.model("Message", messageSchema);