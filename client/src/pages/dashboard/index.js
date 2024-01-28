import { useState } from 'react';
import { useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography
} from '@mui/material';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useSelector } from 'react-redux';
import api from 'routes/Enpoint'

// ==============================|| DASHBOARD - DEFAULT ||============================== //


const DashboardDefault = () => {
  const [slot, setSlot] = useState('week');
  const [dashboardData, setDashboardData] = useState([]);
  const userDetails = useSelector((state => state.userDetails));

  const isAdminUser = userDetails?.userData?.is_admin ? 'Admin' : 'User';
  const userToken = localStorage.getItem('token');

  const getDashboardDetail = async () => {
    try
    {
      const response = await api.get('dashboard/details', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      console.log(response.data.data)
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
      {
        (isAdminUser == "Admin") &&
        <>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Products" count={dashboardData.products}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Order Till Date" count={dashboardData.totalOrder}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total's Earning" count={"Rs. "+dashboardData.todayEarning}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Earning Till Now" count={"Rs. "+dashboardData.totalEarning}/>
          </Grid>
        </>
      }

{
        (isAdminUser == "User") &&
        <>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Products" count={dashboardData.products}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Order Till Date" count={dashboardData.totalOrder}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Pending Order" count={dashboardData.pendingOrder}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Popular Product" count={dashboardData.popularProduct?.name}/>
          </Grid>
        </>
      }
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Unique Visitor</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>

     

  
    </Grid>
  );
};

export default DashboardDefault;
