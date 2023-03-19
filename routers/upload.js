const express = require("express")
const { uploadLinkImg, uploadMulter } = require("../controllor/upload");
const multer  = require('multer')
const upload = multer({ dest: 'uploads' })

const router = express.Router()


router.post("/link-upload", uploadLinkImg)
router.post("/upload-multer",upload.array('photos', 100),uploadMulter)




module.exports = router