const fs = require("fs");
const path = require("path");
const config = require("../config");

// Refactored
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);
const unlinkPromise = util.promisify(fs.unlink);
const readdirPromise = util.promisify(fs.readdir);

// define FILES_DIR
const FILES_DIR = path.join(__dirname, "/../", config.FILES_DIR); //copied from index.js

// declare the handlers
const handlers = {
  readDir: async (req, res, next) => {
    try {
      const list = await readdirPromise(FILES_DIR);
      console.log(FILES_DIR);
      res.json(list);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log(FILES_DIR);
        res.status(404).end();
      }
      console.error(err);
      next(err);
    }
  },

  readFile: async (req, res, next) => {
    const fileName = req.params.name;
    try {
      const fileText = await readFilePromise(
        `${FILES_DIR}/${fileName}`,
        "utf-8"
      );
      const responseData = {
        name: fileName,
        text: fileText,
      };
      res.json(responseData);
    } catch (err) {
      if (err.code === "ENOENT") res.status(404).end();
      console.error(err);
      next(err);
    }
  },

  writeFile: async (req, res, next) => {
    const fileName = req.params.name;
    const fileText = req.body.text;
    try {
      await writeFilePromise(`${FILES_DIR}/${fileName}`, fileText);

      // refactor hint:
      res.redirect(303, "/api/files"); //it was /api/files
      // handlers.getFiles(req, res, next);
    } catch (err) {
      if (err.code === "ENOENT") res.status(404).end();
      console.error(err);
      next(err);
    }
  },

  deleteFile: async (req, res, next) => {
    const fileName = req.params.name;
    try {
      await unlinkPromise(`${FILES_DIR}/${fileName}`);

      // refactor hint:
      res.redirect(303, "/api/files");
      // handlers.getFiles(req, res, next);
    } catch (err) {
      console.error(err);
    }
  },
};

// export the handlers
module.exports = handlers;
