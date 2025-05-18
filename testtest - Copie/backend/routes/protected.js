const express = require("express");
const verifyToken = require("../middlewares/auth");
const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: `Bienvenue, ${req.user.role}` });
});

module.exports = router;
