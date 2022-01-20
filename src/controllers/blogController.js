const blogModel = require("../models/blogModel")

//Q2
const createBlog = async function (req, res) {
    try {
        if(req.body.authorId==req.validToken._id){
            let savedData=await blogModel.create(req.body)
            res.status(201).send({status:true,data:savedData})
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
      const check = await blogModel.find({ isDeleted: false ,authorId:req.validToken._id} );
      
      if (Object.keys(req.query).length === 0) {
       return  res.status(200).send({ status: true, data: check });
  
      }
      else  {
        let result = await blogModel.find({ isDeleted:false,$or: [{ authorId: req.query.authorId }, { tags: req.query.tags }, { category: req.query.category }, { subcategory: req.query.subcategory }] });
        
      if(result.length ==0){
        return res.status(404).send({status:false,msg:"no such blog found"})
      }

       return  res.status(200).send({ status: true, data: result });
      }
    } catch (error) {
     return  res.status(500).send({ status: false, error: error });
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

        res.status(200).send({ data: updatedBlog })

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
       
        let deletedTime = String(new Date());
       
        let DeletedBlog=await blogModel.findOneAndUpdate(filter,{isDeleted: true, deletedAt: deletedTime })
        if(DeletedBlog){
            res.status(200).send( {status: true, msg: "Blog has been deleted" })
        }else{
            res.status(404).send({status: false, msg: "either the blog is already deleted or you are not valid author to access this blog" })
        }
    }
    catch (err) {
       
        res.status(500).send({ msg: err });
    }
}

//Q6-

const specificDelete = async function (req, res) {
    try {
        const filter = {
            isDeleted: false,
            isPublished: false,

        };
        filter["authorId"] = req.validToken._id


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

        if (deleteData) {
            res.status(200).send({ status: true, msg: "Blog has been deleted" });
        } else {
            res.status(404).send({ status: false, msg: "no such blog exist" });
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




