
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        authorId: {
            type: ObjectId,
            required: true,
            ref: "Author"
        },

        tags: [String],
        category: { type: String, required: true },
        subcategory: [String],      
        isPublished: { type: Boolean, default: false },
        publishedAt: String,  
        isDeleted: { type: Boolean, default: false },
        deletedAt: String, 

    }, { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
























