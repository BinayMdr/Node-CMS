import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

import Profile from './Profile';
// ==============================|| HEADER - CONTENT ||============================== //
import {useSelector} from 'react-redux';

const HeaderContent = () => {

  const userDetails = useSelector((state => state.userDetails));
  

  return (
    <>
    <Grid container justifyContent="flex-end">
    <Grid item>
          <Avatar alt="profile user" sx={{ width: 32, height: 32 }}>{userDetails.userData?.name.charAt(0)} </Avatar>
      </Grid>
      <Grid item>
          <Profile style={{paddingLeft: 0 }} userData={userDetails}/>
      </Grid>
    </Grid>
    </>
  );
};

export default HeaderContent;
