const express = require("express");
const { getAllPlece, getWonerPlace, getAvrgase, getMon, getSingalPlace, createTour, deleteTour, updateTour } = require("../controllor/place");
const { authMiddleware } = require("../middlewarer/authMiddlewarer");

const router = express.Router();

router.post("/",authMiddleware,createTour)
router.get("/",getAllPlece)
router.get("/:id",getSingalPlace)
router.get("/owner",authMiddleware,getWonerPlace)
router.get("/avg",getAvrgase)    
router.get("/mon",getMon)
router.patch("/update",authMiddleware,updateTour)
router.delete("/:id",authMiddleware,deleteTour)



module.exports = router;