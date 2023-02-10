const { Router } = require("express");
const router = Router();
const { renderIndex } = require("../controllers/indexControllers.js");
const {getFakeItems} = require("../controllers/indexControllers.js")


router.get("/", renderIndex);

router.get("/api/productos-test", getFakeItems);

module.exports = router