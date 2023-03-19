const express = require("express");
const { creactPlace, getAllPlece, getWonerPlace, getAvrgase, getMon, getSingalPlace } = require("../controllor/place");
const { authMiddleware } = require("../middlewarer/authMiddlewarer");

const router = express.Router();

router.post("/",authMiddleware,creactPlace)
router.get("/",getAllPlece)
router.get("/:id",getSingalPlace)
router.get("/owner",authMiddleware,getWonerPlace)
router.get("/avg",getAvrgase)    
router.get("/mon",getMon)



module.exports = router;