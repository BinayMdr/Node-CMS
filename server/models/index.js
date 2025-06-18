const Offer = require('./offer');
const Branch = require('./branch');
const OfferHasBranch = require('./offerhasbranch');
const Role = require('./role');
const Group = require('./group')
const GroupHasRole = require('./grouphasrole')

Offer.belongsToMany(Branch, {
  through: OfferHasBranch,
  foreignKey: 'offer_id',
  otherKey: 'branch_id',
  as: 'branches'
});

Role.hasMany(Role, {
  as: 'children',
  foreignKey: 'parent_role_id',
});
Role.belongsTo(Role, {
  as: 'parent',
  foreignKey: 'parent_role_id',
});

Group.hasMany(GroupHasRole, { foreignKey: 'group_id' });
GroupHasRole.belongsTo(Group, { foreignKey: 'group_id' });
GroupHasRole.belongsTo(Role, { foreignKey: 'role_id' });


module.exports = {
  Offer,
  Branch,
  OfferHasBranch,
  Role,
  Group,
  GroupHasRole
};
