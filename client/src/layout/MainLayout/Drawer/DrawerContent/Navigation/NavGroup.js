import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { Box, List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const userDetails = useSelector((state => state.userDetails));

  const forAdminUser = userDetails?.userData?.is_admin ? 'Admin' : '';
  const { drawerOpen } = menu;

  const navCollapse = item.children?.map((menuItem) => {
    if(menuItem.hide) return null
    switch (menuItem.forUser) {
      case 'All':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      case forAdminUser:
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
    }
  });

  
  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
