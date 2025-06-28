import { useState } from 'react';
import { useEffect } from 'react';

// material-ui
import {
  Grid,
  Typography
} from '@mui/material';

// project import
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import api from 'routes/Enpoint'

// ==============================|| DASHBOARD - DEFAULT ||============================== //


const DashboardDefault = () => {
  const [dashboardData, setDashboardData] = useState([]);
  

  const userToken = localStorage.getItem('token');

  const getDashboardDetail = async (filter = 'week') => {
    try
    {
      const response = await api.get(`dashboard/details?orderFilterBy=${filter}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      setDashboardData(response.data.data)
    }
    catch(error)
    {
      console.log(error)
    }
  }

  useEffect( () => {
    getDashboardDetail()
  },[])


  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>  
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
        <>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce title="Total Food Categories" count={dashboardData.foodCategories}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce title="Total Food Items" count={dashboardData.foodItems}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce title="Total Message" count={dashboardData.messages}/>
          </Grid>
        </>
     
  
    </Grid>
  );
};

export default DashboardDefault;
