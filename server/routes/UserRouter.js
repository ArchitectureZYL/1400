var express = require('express');
const UserController = require('../controllers/UserController');
var UserRouter = express.Router();
//图片上传
const multer = require('multer')
const upload = multer({
  dest: 'public/avataruploads/'
})


/* GET home page. */
UserRouter.post("/api/user/login", UserController.login)
UserRouter.post("/api/user/upload", upload.single('file'), UserController.upload)
UserRouter.post("/api/user/register", UserController.register)



module.exports = UserRouter;