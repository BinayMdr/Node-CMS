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
  const [imagePreview, setImagePreview] = React.useState(null);


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

      if (convertedObject.bannerImage) {
        setImagePreview(`${process.env.REACT_APP_IMAGE_BASE_URL}${convertedObject.bannerImage}`);
      }

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
          phoneNumber:formValue.phoneNumber,
          email:formValue.email,
          bannerImage: null,
          chatScript:formValue.chatScript,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          phoneNumber: Yup.string().max(255).required('Phone number is required'),
          email: Yup.string().max(255).required('Email is required').email('Incorrect email format')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('email', values.email);
            formData.append('chatScript', values.chatScript);

            if (values.bannerImage) {
              formData.append('bannerImage', values.bannerImage);
            }
              await api.put(`global-setting`, 
                formData
              ,{
                headers: {
                  'Content-Type': 'multipart/form-data',
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                  <InputLabel htmlFor="phoneNumber">Phone Number (*)</InputLabel>
                  <OutlinedInput
                    id="phoneNumber"
                    type="text"
                    value={values.phoneNumber}
                    name="phoneNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    fullWidth
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <FormHelperText error id="standard-weight-helper-text-phoneNumber-login">
                      {errors.phoneNumber}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
                
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email">Email (*)</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
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
                  <InputLabel htmlFor="bannerImage">Banner Image</InputLabel>

                  {values.bannerImage ? (
                    <Box mt={2}>
                      <img
                        src={
                          typeof values.bannerImage === 'string'
                            ? `${process.env.REACT_APP_IMAGE_BASE_URL}${values.bannerImage}` // DB image
                            : URL.createObjectURL(values.bannerImage) // New upload
                        }
                        alt="Banner Preview"
                        style={{
                          width: '100%',
                          maxWidth: '300px',
                          borderRadius: '8px',
                          border: '1px solid #ccc'
                        }}
                      />
                    </Box>
                  ) : 
                  imagePreview && (
                    <Box mt={2}>
                      <img
                        src={imagePreview}
                        alt="Banner Preview"
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', border: '1px solid #ccc' }}
                      />
                    </Box>
                  )
                
                }
                


                  <OutlinedInput
                    id="bannerImage"
                    type="file"
                    name="bannerImage"
                    inputProps={{ accept: 'image/*' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue('bannerImage', file);
                    }}
                    fullWidth
                    error={Boolean(touched.bannerImage && errors.bannerImage)}
                  />
                  {touched.bannerImage && errors.bannerImage && (
                    <FormHelperText error id="standard-weight-helper-text-bannerImage">
                      {errors.bannerImage}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>


              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="chatScript">Chat Script</InputLabel>
                  <OutlinedInput
                    id="chatScript"
                    value={values.chatScript}
                    name="chatScript"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter chat script"
                    fullWidth
                    multiline
                    minRows={4}
                    error={Boolean(touched.chatScript && errors.chatScript)}
                  />
                  {touched.chatScript && errors.chatScript && (
                    <FormHelperText error id="standard-weight-helper-text-chatScript-login">
                      {errors.chatScript}
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
