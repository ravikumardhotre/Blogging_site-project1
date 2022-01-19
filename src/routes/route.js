const express = require('express');
const router = express.Router();


const AuthorController = require("../controllers/authorcontroller")
const BlogController = require("../controllers/blogController")
const middleware = require("../middleware/commonmiddleware")

//Create new Author
router.post('/createAuthors', AuthorController.createAuthor);
//create new blog
router.post('/blogs', middleware.authentication, BlogController.createBlog);
//get blogs
router.get("/blogs", middleware.authentication, BlogController.getThisBlog)
    //update blogs
router.put('/blogs/:blogId', middleware.authentication, BlogController.updateDetails)
    //delete blog by id
router.delete("/blog/:blogId", middleware.authentication, BlogController.deleteBlogById)
    //delete blog by query
router.delete("/blog", middleware.authentication, BlogController.specificDelete)


//login api
router.post("/login", AuthorController.login)




module.exports = router;