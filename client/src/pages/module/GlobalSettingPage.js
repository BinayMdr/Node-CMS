import * as React from 'react';
import {Paper,Button,Box, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput
      } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { updateGlobalName } from "store/reducers/globalSetting";

const GlobalSettingPage = () => {

  const [formValue, setFormValue] = React.useState({"name":"","pan":""})

  const [showData, setShowData] = React.useState(false)
  const userToken = localStorage.getItem('token');

  const dispatch = useDispatch();

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

      setFormValue(convertedObject);
      
      
      setShowData(true)
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  useEffect( () => {
    getGlobalSetting()
  },[])
  
  const style = {
    position: 'relative',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    bgcolor: 'background.paper',
    p: 4
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ToastContainer></ToastContainer>
     { showData &&
      <Box sx={style}>
        <Formik
        initialValues={{
          name: formValue.name,
          pan:formValue.pan,
          email:formValue.email,
          invoicePrefix:formValue?.invoicePrefix,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          pan: Yup.string().max(255).required('PAN is required'),
          email: Yup.string().max(255).email('Enter a valid email address').required('Email is required'),
          invoicePrefix: Yup.string().max(255).required('Invoice Prefix is required')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

              await api.put(`global-setting`, {
                name: values.name,
                pan: values.pan,
                invoicePrefix: values.invoicePrefix,
                email:values.email
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            
            dispatch(updateGlobalName({ globalName: values.name }))
            getGlobalSetting()
            
            toast.success(`Global setting updated successfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            window.location.reload();
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name">Name (*)</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="standard-weight-helper-text-name-login">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="pan">PAN</InputLabel>
                  <OutlinedInput
                    id="pan"
                    type="text"
                    value={values.pan}
                    name="pan"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter pan"
                    fullWidth
                    error={Boolean(touched.pan && errors.pan)}
                  />
                  {touched.pan && errors.pan && (
                    <FormHelperText error id="standard-weight-helper-text-pan-login">
                      {errors.pan}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
                
             
  
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email">Email (*)</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="text"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              
              

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="invoicePrefix">Invoice Prefix (*)</InputLabel>
                  <OutlinedInput
                    id="invoicePrefix"
                    type="text"
                    value={values.invoicePrefix}
                    name="invoicePrefix"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter invoice prefix"
                    fullWidth
                    error={Boolean(touched.invoicePrefix && errors.invoicePrefix)}
                  />
                  {touched.invoicePrefix && errors.invoicePrefix && (
                    <FormHelperText error id="standard-weight-helper-text-invoicePrefix-login">
                      {errors.invoicePrefix}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Update Global Setting
                    </Button>
                  </AnimateButton>
                </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      </Box>
     }
    </Paper>
  );
};

export default GlobalSettingPage;
