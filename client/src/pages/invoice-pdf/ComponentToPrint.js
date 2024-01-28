import * as React from 'react';
import { useEffect,useState } from 'react';
import api from 'routes/Enpoint'
import {Typography,Grid,Stack,Divider} from '@mui/material';
const ComponentToPrint = React.forwardRef((props, ref) => {

  const {invoiceData} = props;
  const userToken = localStorage.getItem('token');

  const [globalSetting, setGlobalSetting] = useState([]);
  const [branchDetail, setBranchDetail] = useState([]);

  const getGlobalSetting = async () => {
    try
    {
      const response = await api.get('global-setting');

      const pluckedData = response.data.data.map(({name,value}) => ({
        name,value
      }));
      
      const convertedObject = pluckedData.reduce((result, { name, value }) => {
        result[name] = value;
        return result;
      }, {});

      setGlobalSetting(convertedObject)
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  const getBranchDetails = async () => {
    try
    {
      console.log(props)
      const response = await api.get('setting', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          branchId: invoiceData.branch_id
        }
      });

     setBranchDetail(response.data.data)
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  useEffect(() => {
    getGlobalSetting()
    getBranchDetails()
  }, [])
  
  return (
    <div ref={ref}>
      <Typography variant="h1" align="center">{globalSetting['name']}</Typography>
      <Typography variant="h5" align="center">{branchDetail['address']}</Typography>
      <Typography variant="h5" align="center">Contact No. : {branchDetail['number']}</Typography>
      <Typography variant="h5" align="center" sx={{marginBottom:"10px"}}>PAN No. :{globalSetting['pan']}</Typography>
      <Typography variant="span" ml={2}>Bill No. :{new Date(invoiceData.createdAt).toISOString().split('T')[0]}</Typography>
      <Grid container my={2}>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Product</Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Qty.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Rate</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Total</Typography>
          </Stack>
        </Grid>


        {
                invoiceData.products.map((invoice) => {
                const { id,name , price, total, quantity} = invoice;
                return (
                  <>
                  <Grid item xs={3} >
                    <Stack spacing={1}>
                      <Typography key={id} ml={2}>{name}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                    <Typography key={id} ml={2}>{quantity}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <Typography key={id} ml={2}>Rs. {price}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <Typography key={id} ml={2}>Rs. {total}</Typography>
                    </Stack>
                  </Grid>
              </>
                );
                })
          }
        <Grid item xs ={12}>
          <Divider />
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Sub. Total</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Rs. {invoiceData.sub_total}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Discount</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">{invoiceData.discount_percent}%</Typography>
          </Stack>
        </Grid>

        { (invoiceData.offer_id != null) &&
            <>
              <Grid item xs={3}>
                <Stack spacing={1}>
                <Typography variant="span" ml={2} fontWeight="bold"></Typography>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                <Typography variant="span" ml={2} fontWeight="bold"></Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                <Typography variant="span" ml={2} fontWeight="bold">Offer</Typography>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1}>
                <Typography variant="span" ml={2} fontWeight="bold">{invoiceData.Offer?.name + " ("+ invoiceData.offer_amount +")"}</Typography>
                </Stack>
              </Grid>
            </>
        }
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Discount Amt.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Rs. {invoiceData.discount_amount}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={5}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={7}>
          <Stack spacing={1}>
            <Divider/>
          </Stack>
        </Grid>

        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Total</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Rs. {invoiceData.total}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Received Amt.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Rs. {invoiceData.received_amount}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold"></Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Changed Amt.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
          <Typography variant="span" ml={2} fontWeight="bold">Rs. {invoiceData.changed_amount}</Typography>
          </Stack>
        </Grid>

      </Grid>
      <Typography variant="span" ml={2}>Prepared By: {invoiceData.preparedBy}</Typography>
      <Typography variant="h5" align="center" my={2}>Thank you form visiting {globalSetting['name']}</Typography>
    </div>
  );
});

export { ComponentToPrint }; // Use named export
