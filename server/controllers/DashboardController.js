const user = require('../models/user');
const invoice = require('../models/invoice');
const invoiceHasProduct = require('../models/invoicehasproduct');
const product = require('../models/product');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize,fn,literal} = require('sequelize');


const dashboardDetails = (async (req,res) => {
  try {

    const decoded = req.decodedData;

    const userData = await user.findOne({
      where: {
        id: decoded['id'],
      }
    }); 

    const data = {};
    data.products = await invoice.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if(!userData.is_admin)
    {
        data.totalOrder = await invoice.count({
            where:{
                branch_id: userData.branch_id
            }
        });

        data.pendingOrder = await invoice.count({
            where:{
                branch_id: userData.branch_id,
                createdAt: {
                    [Op.gte]: today, 
                    [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                },
                status: "Pending"
            }
        })

        const invoiceId = await invoice.findAll({
          where:{
            branch_id: userData.branch_id
          }
        });
        
        const invoiceIdsArray = invoiceId.map(invoice => invoice.id);

        const result = await invoiceHasProduct.findAll({
          attributes: [
            'product_id',
            [fn('COUNT', literal('*')), 'count']
          ],
          where: {
            invoice_id: {
              [Sequelize.Op.in]: invoiceIdsArray
            }
          },
          group: ['product_id'],
          order: [[fn('COUNT', literal('*')), 'DESC']],
          limit: 1
        });
        
        data.popularProduct = await product.findOne({
          where:{
            id: result[0].get('product_id')
          }
        })
    }
    else
    {
        data.totalOrder = await invoice.count();
        data.todayEarning = await invoice.sum('total',{
            where:{
                createdAt: {
                    [Op.gte]: today, 
                    [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                },
                status: "Completed"
            }
        });

        data.totalEarning = await invoice.sum('total',{
          where:{
            status: "Completed"
          }
        })
    }

    return res.json({
        "data": data,
        "error": true
      });
    
  } catch (error) {
    console.log(error)
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});




module.exports = {
    dashboardDetails
}