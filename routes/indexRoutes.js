const { Router } = require("express");
const router = Router();
const { renderIndex } = require("../controllers/indexControllers.js");
const { getFakeItems } = require("../controllers/indexControllers.js");
const { isAuthenticated } = require("../helpers/auth.js");

router.get("/", isAuthenticated, renderIndex);
router.get("/api/productos-test", getFakeItems);

module.exports = router;