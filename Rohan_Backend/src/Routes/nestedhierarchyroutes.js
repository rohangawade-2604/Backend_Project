const express = require("express");
const router = express.Router();

const {nestedhierarchy} = require("../Controller/nestedhierarchy")

// const { Tlm, Slm, Flm, Mr } = require("../../Folders/UserModels/TLM");


router.get("/hierarchy", nestedhierarchy)
router.get("/hierarchy/:id", nestedhierarchy)

module.exports = router;
