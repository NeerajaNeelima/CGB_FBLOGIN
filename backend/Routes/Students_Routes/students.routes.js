const express = require('express');
const {Edit_Profile,Get_Student_Details,Search_Student,getAllCountry,getAllCity} = require('../../Controllers/Student/student.controller')
const protectRoute=require('../../Middleware/protectRoute')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads/profile-pictures',
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage, fileFilter })


router.get('/get-student-details',protectRoute,Get_Student_Details);

router.post('/edit-profile',protectRoute,upload.single('profilePic'),Edit_Profile);

router.get('/search',protectRoute,Search_Student)

router.get('/getAllCountry',getAllCountry);

router.get('/getAllCity',getAllCity);

module.exports=router;