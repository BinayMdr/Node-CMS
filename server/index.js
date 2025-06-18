const express = require('express');
const cors = require('cors');
const sequelize = require('./database/database.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//routes
const authenticateRoute = require('./routes/authenticateRoute')
const branchRoute = require('./routes/branchRoute.js');
const paymentRoute = require('./routes/paymentRoute.js');
const globalsettingRoute = require('./routes/globalsettingRoute.js');
const settingRoute = require('./routes/settingRoute.js');
const productRoute = require('./routes/productRoute.js');
const invoiceRoute = require('./routes/invoiceRoute.js');
const userRoute = require('./routes/userRoute.js');
const offerRoute = require('./routes/offerRoute.js');
const dashboardRoute = require('./routes/dashboardRoute.js');
const roleRoute = require('./routes/roleRoute.js');
const expenditureRoute = require('./routes/expenditureRoute.js');
const historyRoute = require('./routes/historyRoute.js')
const customerRoute = require('./routes/customerRoute.js')
const groupRoute = require('./routes/groupRoute.js')
const resetPasswordRoute = require('./routes/resetPasswordRoute.js')

require("dotenv").config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folder = 'uploads/default';
  
      if (req.baseUrl.includes('product')) {
        folder = 'uploads/products';
      } else if (req.baseUrl.includes('user-profile')) {
        folder = 'uploads/user-profile';
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
  
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, jpeg, and png files are allowed'), false);
    }
  };


  const upload = multer({ storage,fileFilter });

//Route
app.use("/",authenticateRoute);
app.use("/branch",branchRoute);
app.use("/payment",paymentRoute);
app.use("/global-setting",globalsettingRoute);
app.use("/product",upload.single("image"),productRoute);
app.use("/invoice",invoiceRoute);
app.use("/user",userRoute);
app.use("/offer",offerRoute);
app.use("/dashboard",dashboardRoute);
app.use("/role",roleRoute);
app.use("/setting",settingRoute);
app.use("/expenditure",expenditureRoute);
app.use("/history",historyRoute);
app.use("/customer",customerRoute);
app.use("/group",groupRoute);
app.use("/reset-password",resetPasswordRoute);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

app.listen(process.env.PORT, () => {
    console.log('now listening for requests on port ', process.env.PORT);
});