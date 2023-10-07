const express = require('express');
const cors = require('cors');
const sequelize = require('./database/database.js');
const bodyParser = require('body-parser');

//routes
const authenticateRoute = require('./routes/authenticateRoute')
const branchRoute = require('./routes/branchRoute.js');
const paymentRoute = require('./routes/paymentRoute.js');
const globalsettingRoute = require('./routes/globalsettingRoute.js');

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

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

app.listen(process.env.PORT, () => {
    console.log('now listening for requests on port ', process.env.PORT);
});