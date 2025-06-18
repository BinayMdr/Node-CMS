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
import { useParams } from 'react-router-dom';
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthResetPassword = () => {
  const { token } = useParams();
  
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

  const verifyToken = async() => {
    try
    {
      const response = await api.get(`reset-password/verify-token/${token}`);

      if(!response.data.message) navigate("/login")
    }
    catch(error)
    {
      console.log(error)
    }
  }

  useEffect(() => {
    redirectToDashboard()
    verifyToken()
  });

  return (
    <>
     <ToastContainer></ToastContainer>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().required('Password is required'),
          confirmPassword: Yup.string().required('Confirm Password is required'),
        })}
        onSubmit={async (values, {setStatus, setSubmitting, resetForm }) => {
          try {

            let message = '';
              if(values.password == undefined) message = "Password length must be equal or greater than 6 digits"
              else if(values.password.length < 6) message = "Password length must be equal or greater than 6 digits"
              if( values.password !== values.confirmPassword) 
              {
                message = "Password and confirm password should match";
              }

              if(message != "")
              {
                toast.error(message, {
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

            setStatus({ success: false });
            setSubmitting(false);
            
            const response = await api.post(`reset-password/change-password/${token}`, {
                password: values.password
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
            navigate('/login')
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
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    id="password-login"
                    type="password"
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter password"
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
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
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Change Password
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

export default AuthResetPassword;
