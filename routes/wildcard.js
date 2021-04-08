var express = require("express"),
    router = express.Router();

// SHOW(GET): 404 PAGE/ALL
router.get("/*", function(req, res) {
    res.render("index/no-page");
});

module.exports = router;