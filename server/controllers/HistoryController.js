require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const history = require("../models/history")
const productHasVariation = require('../models/productHasVariation')
const product = require('../models/product')
const branch = require('../models/branch')

const getAllHistory = (async (req,res) => {
  try {
    const productId = req.params.productId;

    let {page,pageSize,branchId,variationId} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    let variationIds = []

    if (branchId) {
        const branchData = await branch.findOne({
          where:{
            name: branchId
          }
        })

        const productHasVariationData = await productHasVariation.findAll({
        where:{
          branch_id: branchData.dataValues.id,
          product_id: productId
        }
      }) 

      variationIds =  productHasVariationData.map(v => v.id)
    }
    else
    {
      const productHasVariationData = await productHasVariation.findAll({
        where:{
          product_id: productId
        }
      }) 

      variationIds =  productHasVariationData.map(v => v.id)
    }
    
    if (variationId) {
      if(branchId)
      {
        const branchData = await branch.findOne({
          where:{
            name: branchId
          }
        })

        const variationData = await productHasVariation.findAll({
          where:{
            colorCombination: variationId,
            branch_id: branchData.dataValues.id
          }
        })

        where.product_has_variation_id = variationData.map(v=>v.id);
      }
      else
      {
    
        const variationData = await productHasVariation.findAll({
          where:{
            colorCombination: variationId
          }
        })

        where.product_has_variation_id = variationData.map(v=>v.id);
      }
    }
    else
    {
      where.product_has_variation_id = variationIds
    }

    const historyData = await history.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });

    for (let i = 0; i < historyData.length; i++) {
    const variation = await productHasVariation.findOne({
      where: {
        id: historyData[i]['product_has_variation_id']
      }
    });

    const productData = await product.findOne({
      where: {
        id: variation.dataValues.product_id
      }
    });

    const branchData = await branch.findOne({
      where: {
        id: variation.dataValues.branch_id
      }
    });

    historyData[i]['dataValues']['variation'] = variation.dataValues;
    historyData[i]['dataValues']['product'] = productData.dataValues;
    historyData[i]['dataValues']['branch'] = branchData.dataValues;
  }

    const historyCount = await history.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(historyCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(historyCount/pageSize))
    };

    return res.json({
      "data": historyData,
      "pageInfo": pageInfo,
      "error": false
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
    getAllHistory
}