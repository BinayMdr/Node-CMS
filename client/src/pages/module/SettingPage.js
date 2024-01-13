import * as React from 'react';
import {Paper,Button,Box, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput, Select, MenuItem
      } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingPage = () => {

  const [addressError, setAddressError] = React.useState(false)
  const [numberError, setNumberError] = React.useState(false)

 
  const userToken = localStorage.getItem('token');

  const [branchList,setBranchList] = React.useState([]);
  const [branch,setBranch] = React.useState('');
  const [address,setAddress] = React.useState('');
  const [number,setNumber] = React.useState('');

  const getBranchList = async () => {
    try
    {
      const response = await api.get('branch/get-list', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      setBranchList(response.data.data)
      getSettingData(response.data.data[0]['id'])
      
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  const getSettingData = async (id) => {
    try
    {
      setAddressError(false)
      setNumberError(false)
      setBranch(id)

      const settingResponse = await api.get('setting', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          branchId: id
        }
      });

      if(settingResponse.data.data != null) 
      {
        setAddress(settingResponse.data.data.address)
        setNumber(settingResponse.data.data.number)
      }
      else
      {
        setAddress('')
        setNumber('')
      }
      
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  useEffect( () => {
    getBranchList()
  },[])
  
  const handleBranchChange = (event) => {
    setBranch(event.target.value);
    getSettingData(event.target.value)
  };

  const handleAddressChange = (event) => {
    setAddressError(false)
    setAddress(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumberError(false)
    setNumber(event.target.value);
  };

  const handleAddressBlur = () => {
    if( address == "") setAddressError(true)
  }

  const handleNumberBlur = () => {
    if( number == "") setNumberError(true)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    p: 4,
    marginTop:'40px'
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ToastContainer></ToastContainer>
     
      <Box sx={style}>
        <Formik
        initialValues={{
          address: address,
          number:number,
          submit: null
        }}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
              if( address != "" || number != "")
              {
                await api.put(`setting`, {
                  address: address,
                  number: number,
                  branchId:branch
                },{
                  headers: {
                    'Authorization': `Bearer ${userToken}`
                  }
                });
              
              toast.success(`Setting updated successfully`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
            }
            else
            {
              if(address == "") setAddressError(true);
              if(number == "") setNumberError(true); 
              return false;
            }

          } catch (err) {
            setStatus({ success: false });
            setSubmitting(false);
            if(err.response.status == "400")
            {
              toast.error(err.response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            }
          }
        }}
      >
        {({ errors, handleSubmit, isSubmitting, touched}) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="branch">Branch</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={branch}
                      onChange={handleBranchChange}
                    >
                      {
                        branchList.map((branch) => {
                        const { id, name } = branch;
                        return (
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>
                        );
                        })
                      }
                    </Select>
                  {touched.branch && errors.branch && (
                    <FormHelperText error id="standard-weight-helper-text-branch-login">
                      {errors.branch}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="address">Address</InputLabel>
                  <OutlinedInput
                    id="address"
                    type="text"
                    value={address}
                    name="address"
                    onBlur={handleAddressBlur}
                    onChange={handleAddressChange}
                    placeholder="Enter address"
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />
                  { addressError && (
                    <FormHelperText error id="standard-weight-helper-text-address-login">
                      Address is required
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="number">Number</InputLabel>
                  <OutlinedInput
                    id="number"
                    type="text"
                    value={number}
                    name="number"
                    onBlur={handleNumberBlur}
                    onChange={handleNumberChange}
                    placeholder="Enter number"
                    fullWidth
                    error={Boolean(touched.number && errors.number)}
                  />
                  {numberError && (
                    <FormHelperText error id="standard-weight-helper-text-number-login">
                      Number is required
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Update Setting
                    </Button>
                  </AnimateButton>
                </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      </Box>
     
    </Paper>
  );
};

export default SettingPage;
