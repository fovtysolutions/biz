const express = require("express");
const router = express.Router();
const {
  testing,
  testing2,
  testing3,
} = require("../controller/testController2");

router.get("/", testing);
router.get("/hii", testing2);
router.get("/hello", testing3);

module.exports = router;
