const multer = require('multer');

module.exports = {
    getFileOptions: () => {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, "assets/avatars");
                },
                filename: (req, file, cb) => {
                    cb(
                        null,
                        `${new Date().toISOString().replace(/:/g, "-")}${file.originalname}`
                    );
                }
            }),

            fileFilter: (req, file, cb) => {
                if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                    cb(null, true);
                } else {
                    cb("Only .jpeg or png files are accepted", false);
                }
            }
        }
    },
    getFileOptionsMsg: () => {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, "assets/files");
                },
                filename: (req, file, cb) => {
                    cb(
                        null,
                        `${new Date().toISOString().replace(/:/g, "-")}${file.originalname}`
                    );
                }
            })
        }
    },
    getFileOptionsUpload: () => {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, "assets/images");
                },
                filename: (req, file, cb) => {
                    cb(
                        null,
                        `${new Date().toISOString().replace(/:/g, "-")}${file.originalname}`
                    );
                }
            }),

            fileFilter: (req, file, cb) => {
                if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                    cb(null, true);
                } else {
                    cb("Only .jpeg or png files are accepted", false);
                }
            }
        }
    },
}