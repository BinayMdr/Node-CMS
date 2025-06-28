const Role = require('./role');
const Group = require('./group')
const GroupHasRole = require('./groupHasRole')



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
  Role,
  Group,
  GroupHasRole
};