const { Router } = require("express");
const router = Router();
const { renderUserLogout, loginForm,signin } = require("../controllers/authControllers.js");

router.get("/auth/login", loginForm);
router.post("/auth/login", signin);
router.get("/auth/logout", renderUserLogout);

module.exports = router