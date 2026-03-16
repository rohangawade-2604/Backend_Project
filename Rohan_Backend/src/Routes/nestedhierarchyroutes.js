const express = require("express");
const router = express.Router();

const {nestedhierarchy} = require("../Controller/nestedhierarchy")
// const {fullhierarchy} = require("../Controller/fullhierarchy")

// const { Tlm, Slm, Flm, Mr } = require("../../Folders/UserModels/TLM");


// router.get("/hierarchy", fullhierarchy)
router.get("/hierarchy/:id", nestedhierarchy)

module.exports = router;
