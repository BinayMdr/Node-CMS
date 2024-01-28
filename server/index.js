const express = require('express');
const cors = require('cors');
const sequelize = require('./database/database.js');
const bodyParser = require('body-parser');

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

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//Route

app.use("/",authenticateRoute);
app.use("/branch",branchRoute);
app.use("/payment",paymentRoute);
app.use("/global-setting",globalsettingRoute);
app.use("/setting",settingRoute);
app.use("/product",productRoute);
app.use("/invoice",invoiceRoute);
app.use("/user",userRoute);
app.use("/offer",offerRoute);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

app.listen(process.env.PORT, () => {
    console.log('now listening for requests on port ', process.env.PORT);
});