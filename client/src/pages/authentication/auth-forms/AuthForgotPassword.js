import React from 'react';

import { useEffect } from 'react';
// import axios from 'axios'; // Import axios
import api from '../../../routes/Enpoint'
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { useNavigate } from 'react-router-dom';
import { tokenStatus } from 'utils/token-utils';
import { useDispatch } from 'react-redux';
import { addUserData, addBranchData } from 'store/reducers/userDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthForgotPassword = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const redirectToDashboard = async () => {
    const tokenCondition = await tokenStatus();

    if(tokenCondition.status) 
    {
      dispatch(addUserData({ userData: tokenCondition.data.user }))
      dispatch(addBranchData({ branchData: tokenCondition.data.branch }))
      navigate('/dashboard');
    }
    
  };

  useEffect(() => {
    redirectToDashboard()
  });

  return (
    <>
     <ToastContainer></ToastContainer>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values, {setStatus, setSubmitting, resetForm }) => {
          try {
            console.log(values.email)
            setStatus({ success: false });
            setSubmitting(false);
            
            const response = await api.post("reset-password", {
                email: values.email
            });

            toast.success(`${response.data.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            resetForm();
          } catch (err) {
            setStatus({ success: false });
            toast.error(`${err.response.data.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
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
              
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Send Reset Link
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
