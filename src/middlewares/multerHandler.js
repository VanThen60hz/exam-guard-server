const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary.config");

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Please upload an image file (jpg, jpeg, png, gif)."), false);
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "exam-guard",
        allowed_formats: ["jpg", "png", "jpeg", "gif"],
    },
});

const upload = multer({
    storage: storage,
}).fields([{ name: "avatar", maxCount: 1 }]);

const handleImageUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.message && err.message.includes("Invalid file type")) {
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: "An unexpected error occurred during file upload.",
            });
        }
        next();
    });
};

module.exports = { handleImageUpload };
