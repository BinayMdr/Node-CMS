import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = (dashboardData) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;
  const [series,setSeries] = useState({});

  useEffect(() => {
    const earningPerDay = dashboardData.dashboardData.earningPerDay.map((e) => e.total)
    
    setSeries([{name:'Earning',data : earningPerDay}])
   
  },[dashboardData]);

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      
      colors: [info],
      xaxis: {
        categories: dashboardData?.dashboardData.earningPerDay.map((order) => order.day_name),
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      tooltip: {
        theme: 'light'
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, info, secondary]);
  
  return (
    <div id="chart">
      { series && series.length > 0 &&
        <ReactApexChart options={options} series={series} type="bar" height={365} />
      }
    </div>
  );
};

export default MonthlyBarChart;
