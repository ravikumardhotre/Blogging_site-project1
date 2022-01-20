
const AuthorModel = require("../models/authorsModel")
const jwt = require('jsonwebtoken')


//Q1
const createAuthor = async function (req, res) {
    try {
        var data = req.body
       
        if (data) {
            let savedData = await AuthorModel.create(data)
            res.status(200).send({ status: true, msg: savedData })
        } else {
            res.status(400).send({ status: false, msg: "Mandatory body missing" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




///Authentication

//Q1
const login= async function (req, res) {

    let loginBody=req.body;
    let author=await AuthorModel.findOne({$and:[{email:loginBody.email},{password:loginBody.password}]})
   
    
    if (author){
        let token=await jwt.sign({_id:author._id},"radium")
        res.setHeader("x-api-key",token) 
        res.send({status:true,msg:"user logged in successfully"})
         
    }else{
       res.status(500).send({ status: false, msg: err.message })
        })
    }
        
}



module.exports.createAuthor = createAuthor
module.exports.login=login

