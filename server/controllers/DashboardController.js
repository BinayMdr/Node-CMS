const user = require('../models/user');
const invoice = require('../models/invoice');
const invoiceHasProduct = require('../models/invoicehasproduct');
const product = require('../models/product');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize,fn,col,literal} = require('sequelize');


const dashboardDetails = (async (req,res) => {
  try {

    const decoded = req.decodedData;
   
    const userData = await user.findOne({
      where: {
        id: decoded['id'],
      }
    }); 

    const data = {};
    data.products = await product.count();

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

        if(data.todayEarning == null) data.todayEarning = 0;
        
        data.totalEarning = await invoice.sum('total',{
          where:{
            status: "Completed"
          }
        }) ?? 0
        
        if(req.query.orderFilterBy == "week") data.noOfOrder = await getOrdersPerDay();
        else data.noOfOrder = await getOrdersPerLast12Months();

        data.earningPerDay = await getEarningPerDay();

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

async function getOrdersPerDay() {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
      // Generate last 7 days
      const dateArray = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0];
      });

      // Query for order counts
      const ordersPerDay = await invoice.findAll({
          attributes: [
              [fn('DATE', col('createdAt')), 'order_date'],
              [fn('DAYNAME', col('createdAt')), 'day_name'],
              [fn('COUNT', col('*')), 'total_orders']
          ],
          where: {
              createdAt: { [Op.between]: [sevenDaysAgo, today] },
              // status: 'Completed'
          },
          group: [fn('DATE', col('createdAt')), fn('DAYNAME', col('createdAt'))],
          order: [[fn('DATE', col('createdAt')), 'ASC']]
      });

      // Map results to date
      const ordersMap = new Map(ordersPerDay.map(record => [record.dataValues.order_date,record]));
     
      const result = dateArray.map(date => ({
          order_date: date,
          day_name: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
          total_orders: (ordersMap.get(date)?.dataValues || { total_orders: 0 }).total_orders
      }));

      return result.reverse();
  } catch (error) {
      console.error('Error:', error);
  }
}

async function getOrdersPerLast12Months() {
  try {
      const today = new Date();
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setMonth(today.getMonth() - 12);

      const monthArray = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          return {
              month: date.toISOString().split('T')[0].substring(0, 7), // Get YYYY-MM format
              monthName: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }) // Format month name
          };
      });

      // Query for order counts for the last 12 months
      const ordersPerMonth = await invoice.findAll({
          attributes: [
              [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'order_month'],
              [fn('COUNT', col('*')), 'total_orders']
          ],
          where: {
              createdAt: { [Op.between]: [twelveMonthsAgo, today] },
              status: 'Completed'
          },
          group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m')],
          order: [[fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'ASC']]
      });

      // Map results to month
      const ordersMap = new Map(ordersPerMonth.map(record => [record.dataValues.order_month, record]));

      console.log(ordersMap)
      // Fill in missing months
      const result = monthArray.map(({ month, monthName }) => ({
          month, // YYYY-MM format
          monthName, // Full month name
          total_orders: (ordersMap.get(month)?.dataValues || { total_orders: 0 }).total_orders
      }));

      return result.reverse();
  } catch (error) {
      console.error('Error:', error);
  }
}

async function getEarningPerDay() {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
      // Generate last 7 days
      const dateArray = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0];
      });

      // Query for order counts
      const ordersPerDay = await invoice.findAll({
          attributes: [
              [fn('DATE', col('createdAt')), 'order_date'],
              [fn('DAYNAME', col('createdAt')), 'day_name'],
              [fn('SUM', col('total')), 'total']
          ],
          where: {
              createdAt: { [Op.between]: [sevenDaysAgo, today] },
              status: 'Completed'
          },
          group: [fn('DATE', col('createdAt')), fn('DAYNAME', col('createdAt'))],
          order: [[fn('DATE', col('createdAt')), 'ASC']]
      });

      // Map results to date
      const ordersMap = new Map(ordersPerDay.map(record => [record.dataValues.order_date,record]));
     
      const result = dateArray.map(date => ({
          order_date: date,
          day_name: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
          total: (ordersMap.get(date)?.dataValues || { total: 0 }).total
      }));

      return result.reverse();
  } catch (error) {
      console.error('Error:', error);
  }
}
module.exports = {
    dashboardDetails
}