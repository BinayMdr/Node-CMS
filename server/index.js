const express = require('express');
const cors = require('cors');
const sequelize = require('./database/database.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//routes
const authenticateRoute = require('./routes/authenticateRoute')
const globalsettingRoute = require('./routes/globalsettingRoute.js');
const productRoute = require('./routes/productRoute.js');
const userRoute = require('./routes/userRoute.js');
const dashboardRoute = require('./routes/dashboardRoute.js');
const galleryRoute = require('./routes/galleryRoute.js');
const messageRoute = require('./routes/messageRoute.js');
const customerReviewRoute = require('./routes/customerReviewRoute.js');
const aboutUsRoute = require('./routes/aboutUsPageRoute.js');

require("dotenv").config();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/default';

    if (req.baseUrl.includes('global-setting')) {
      folder = 'uploads/global-settings';
    } else if (req.baseUrl.includes('user-profile')) {
      folder = 'uploads/user-profile';
    }
    else if (req.baseUrl.includes('gallery')) {  
      folder = 'uploads/gallery';
    }
    else if (req.baseUrl.includes('about-us')) {  
      folder = 'uploads/about-us';
    }

    const uploadDir = path.join(process.cwd(), folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({ storage,fileFilter:imageFileFilter });

//Route
app.use("/",authenticateRoute);
app.use("/global-setting",upload.single('bannerImage'),globalsettingRoute);
app.use("/product",productRoute);
app.use("/user",userRoute);
app.use("/dashboard",dashboardRoute);
app.use('/gallery',upload.single('file'), galleryRoute);
app.use('/message',messageRoute);
app.use('/customer-review',customerReviewRoute);
app.use('/about-us',upload.single('image'),aboutUsRoute);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

app.listen(process.env.PORT, () => {
    console.log('now listening for requests on port ', process.env.PORT);
});