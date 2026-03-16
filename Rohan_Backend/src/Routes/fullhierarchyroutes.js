const express = require("express");

const router = express.Router();


const {fullhierarchy} = require("../Controller/fullhierarchy");

router.get("/hierarchy", fullhierarchy);

module.exports = router