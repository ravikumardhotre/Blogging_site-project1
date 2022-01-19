const blogModel = require("../models/blogModel")
const AuthorModel = require("../models/authorsModel")

//Q2
const createBlog = async function (req, res) {
    try {
        if(req.body.authorId==req.validToken._id){
            let savedData=await blogModel.create(req.body)
            res.status(200).send({status:true,data:savedData})
        }else(
            res.status(404).send({status:false,msg:"provide your authorId"})
        )
    } catch (error) {
        console.log(error)
        res.status(400).send({ status: false, msg: "server error" })
    }
};




//Q3
const getThisBlog = async function (req, res) {

    try {
        
       if(Object.values(req.query).length===0){
            let filter={isDeleted:false,isPublished:true,authorId:req.validToken._id}
            let data=await blogModel.findOne(filter)
            if(data){
                res.status(200).send({status:true,data:data})
            }else{
                res.status(404).send({status:false,msg:"no such blog found"})
            }
           
       }else{
           req.query["authorId"]=req.validToken._id
           data=await blogModel.find(req.query)
           if(data){
               res.status(200).send({status:true,data:data})
           }else{
               res.status(404).send({status:false,msg:"no such blog found"})
           }
           }
        }
    catch (err) {
        console.log(err)
        res.send(err)
    }
}

//Q4-
const updateDetails = async function (req, res) {
    try {
        const title = req.body.title;
        const body = req.body.body;
        const tags = req.body.tags;
        const subcategory = req.body.subcategory;
        let id=req.validToken._id
        let Update = {}
        Update.title = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id }, { title: title }, { new: true })

        Update.body = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { body: body }, { new: true })

        Update.tags = await blogModel.findOneAndUpdate({ _id: req.params.blogId , isDeleted:false, authorId:id}, { $push: { tags: tags } }, { new: true })

        Update.subcategory = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { $push: { subcategory: subcategory } }, { new: true })

        Update.isPublished = await blogModel.findOneAndUpdate({ _id: req.params.blogId , isDeleted:false, authorId:id }, { isPublished: true }, { new: true })

        Update.publishedAt = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { publishedAt: String(new Date()) }, { new: true })
        
        let updatedBlog = await blogModel.find({ _id: req.params.blogId, isDeleted:false, authorId:id })

        res.send({ data: updatedBlog })

    } catch (err) {
        res.status(500).send({ msg: err });
    }

}





//Q5-
let deleteBlogById = async function (req, res) {
    try {
       
        let filter={isDeleted:false}  
        filter["authorId"]=req.validToken._id
        filter["_id"]=req.params.blogId
        console.log(filter)
        let deletedTime = String(new Date());
       
        let DeletedBlog=await blogModel.findOneAndUpdate(filter,{isDeleted: true, deletedAt: deletedTime })
        if(DeletedBlog){
            res.status(200).send( {status: true, msg: "Blog has been deleted" })
        }else{
            res.status(404).send({status: false, msg: "either the blog is already deleted or you are not valid author to access this blog" })
        }
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
}

//Q6-

const specificDelete = async function (req, res) {
    try {
        if(Object.values(req.query).length===0){
           res.status(404).send({msg:"please provide the query it's needed to delete this blog"})
        }else{
            const filter = {
                isDeleted: false,
                isPublished:false,
            };
            filter["authorId"]=req.validToken._id
            
            if (req.query.category) {
                filter["category"] = req.query.category;
            }
            if (req.query.AuthorId) {
            filter["authorId"] = req.query.AuthorId;
            }
            if (req.query.tags) {
                filter["tags"] = req.query.tags;
            }
            if (req.query.subcategory) {
                filter["subcategory"] = req.query.subcategory;
            }
            
            let deletedTime = String(new Date());
            let deleteData = await blogModel.findOneAndUpdate(filter, {
                isDeleted: true,
                deletedAt: deletedTime
            });
            console.log(deleteData)
            if (deleteData) {
                res.status(200).send({ status: true, msg: "Blog has been deleted" });
            } else {
                res.status(404).send({ status: false, msg: "no such blog exist" });
            }
        }
        
    } catch {
        res.status(500).send({ status: false, msg: "Something went wrong" });
    }
}



module.exports.createBlog = createBlog;
module.exports.getThisBlog = getThisBlog;
module.exports.updateDetails = updateDetails
module.exports.deleteBlogById = deleteBlogById
module.exports.specificDelete = specificDelete




