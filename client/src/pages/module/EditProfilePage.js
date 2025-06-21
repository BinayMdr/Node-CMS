import * as React from 'react';
import {Paper,Button,Box, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput
      } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import api from 'routes/Enpoint'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfilePage = () => {

  const userToken = localStorage.getItem('token');
  
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
     
      <Box sx={style}>
        <Formik
        initialValues={{
          oldPassword: '',
          newPassword:'',
          confirmPassword:'',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required('Old password is required'),
          newPassword: Yup.string().min(6,'New Password must be equal or greater than 6 digits')
                    .required('New password is required'),
          confirmPassword: Yup.string().min(6,'Confirm Password must be equal or greater than 6 digits')
                    .required('Confirm password is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting ,resetForm}) => {
          try {
            resetForm()
            if( values.newPassword === values.oldPassword) 
            {
              toast.error("New password should match old password", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });

              
              return false;
            } 
            if( values.newPassword !== values.confirmPassword) 
            {
              toast.error("Password and confirm password should match", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });

              
              return false;
            }  
              await api.put(`user/update-password`, {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              
            resetForm()
            toast.success(`Profile updated successfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="oldPassword">Old Password</InputLabel>
                  <OutlinedInput
                    id="oldPassword"
                    type="password"
                    value={values.oldPassword}
                    name="oldPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter old password"
                    fullWidth
                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                  />
                  {touched.oldPassword && errors.oldPassword && (
                    <FormHelperText error id="standard-weight-helper-text-oldPassword-login">
                      {errors.oldPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="newPassword">New Password</InputLabel>
                  <OutlinedInput
                    id="newPassword"
                    type="password"
                    value={values.newPassword}
                    name="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    fullWidth
                    error={Boolean(touched.newPassword && errors.newPassword)}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <FormHelperText error id="standard-weight-helper-text-newPassword-login">
                      {errors.newPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="standard-weight-helper-text-confirmPassword-login">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Update Password
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

export default EditProfilePage;
