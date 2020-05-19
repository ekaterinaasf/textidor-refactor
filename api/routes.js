// require the handlers
const handlers = require("./handlers.js");
const express = require("express");

// build the router
const router = express.Router();

router.get("/", (req, res) => {
  res.send("files API!");
});

// add routes to router
router.get("/files", handlers.readDir);

router.get("/files/:name", handlers.readFile);

router.post("/files/:name", handlers.writeFile);

router.delete("/files/:name", handlers.deleteFile);
// export the router
module.exports = router;
