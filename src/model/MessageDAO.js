import mongoose from "mongoose";
import {UserDAO} from "../DAO/UserDAO.js";

export default class MessageDAO {
    Message;
    constructor() {
        const messageSchema = new mongoose.Schema({
            _id: Number,
            date: String,
            hour: String,
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
                date: String,
                hour: String
            }]
        });

        this.Message = mongoose.model("Message", messageSchema, "tPosts");
    }

    async getPost() {
        const messages = await this.Message.find().lean();
        const users = await new UserDAO().find();

        messages.forEach(mess => {
            const user = users.filter(u => u.id === mess.createdBy);
            mess.author = user ? user.map(({username, nom, prenom, avatar, status}) => ({username, nom, prenom, avatar, status}))[0] : null;

            mess.comments.forEach((comment, index) => {
                if (typeof comment !== 'string' && Object.keys(comment).length > 0) {
                    const user = users.filter(u => u.id === comment.commentedBy);
                    comment.author = user ? user.map(({username, nom, prenom, avatar, status}) => ({
                        username,
                        nom,
                        prenom,
                        avatar,
                        status
                    }))[0] : null;
                }
            });
        });
        messages.forEach(mess => {
            if (mess.hasOwnProperty('Shared') && mess.Shared > 0) {
                mess.sharedOriginalData = messages.find(m => m._id === mess.Shared);
            }
        });
        return messages;
    }

    async getPostByUsername(id) {
        const messages = await this.Message.find({createdBy: id}).lean();
        const users = await new UserDAO().find();

        messages.forEach(mess => {
            const user = users.filter(u => u.id === mess.createdBy);
            mess.author = user ? user.map(({username, nom, prenom, avatar, status}) => ({username, nom, prenom, avatar, status}))[0] : null;

            mess.comments.forEach((comment, index) => {
                if (typeof comment !== 'string' && Object.keys(comment).length > 0) {
                    const user = users.filter(u => u.id === comment.commentedBy);
                    comment.author = user ? user.map(({username, nom, prenom, avatar, status}) => ({
                        username,
                        nom,
                        prenom,
                        avatar,
                        status
                    }))[0] : null;
                }
            });
        });
        messages.forEach(mess => {
            if (mess.hasOwnProperty('Shared') && mess.Shared > 0) {
                mess.sharedOriginalData = messages.find(m => m._id === mess.Shared);
            }
        });
        return messages;
    }

    async addComment(comment, id) {
        return await this.Message.updateOne({_id: id}, {$push: {comments: comment}})
    }

    async getPostByHashtag(_hashtags) {
        const messages = await this.Message.find({hashtags: _hashtags}).lean();
        const users = await new UserDAO().find();

        messages.forEach(mess => {
            const user = users.filter(u => u.id === mess.createdBy);
            mess.author = user ? user.map(({username, nom, prenom, avatar, status}) => ({username, nom, prenom, avatar, status}))[0] : null;

            mess.comments.forEach((comment, index) => {
                if (typeof comment !== 'string' && Object.keys(comment).length > 0) {
                    const user = users.filter(u => u.id === comment.commentedBy);
                    comment.author = user ? user.map(({username, nom, prenom, avatar, status}) => ({
                        username,
                        nom,
                        prenom,
                        avatar,
                        status
                    }))[0] : null;
                }
            });
        });
        messages.forEach(mess => {
            if (mess.hasOwnProperty('Shared') && mess.Shared > 0) {
                mess.sharedOriginalData = messages.find(m => m._id === mess.Shared);
            }
        });
        return messages;

    }

    async updateLikes(incr, id) {
        if (incr) {
            return await this.Message.updateOne({_id: id}, {$inc: {likes: 1}})
        }
        else {
            return await this.Message.updateOne({_id: id}, {$inc: {likes: -1}})
        }
    }

    async addRepost(body, url, title, tags, userId, postId) {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const hour = today.getHours() + ':' + today.getMinutes();
        const lastPost = await this.Message.findOne({_id: {$exists: true}}).sort({ _id: -1 }).limit(1);
        const newId = lastPost._id + 1;

        return await this.Message.create({
            _id: newId,
            date: date,
            hour: hour,
            body: body,
            createdBy: userId,
            images: {
                url: url,
                title: title,
            },
            likes: 0,
            hashtags: tags,
            comments: [],
            Shared: postId
        });
    }
}

//export default mongoose.model("Message", messageSchema, "tPosts");