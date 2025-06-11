const Offer = require('./offer');
const Branch = require('./branch');
const OfferHasBranch = require('./offerhasbranch');

Offer.belongsToMany(Branch, {
  through: OfferHasBranch,
  foreignKey: 'offer_id',
  otherKey: 'branch_id',
  as: 'branches'
});


module.exports = {
  Offer,
  Branch,
  OfferHasBranch,
};
