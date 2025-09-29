import * as React from 'react';
import {Paper,Button,Box, Grid,
        Stack, InputLabel,FormHelperText
      } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RichTextEditor from 'pages/components-overview/RichTextEditor';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AboutUsPage = () => {
   const userDetails = useSelector((state => state.userDetails));
    const navigate = useNavigate();
  const [formValue, setFormValue] = React.useState({"name":"","pan":""})
  

  const [showData, setShowData] = React.useState(false)
  const userToken = localStorage.getItem('token');

  const getAboutUs = async () => {
    try
    {
      const response = await api.get('about-us');

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
    getAboutUs()
  },[])

   useEffect( () => {
      if(!userDetails?.accessModuleData.includes("View-about-us")){
        navigate('/dashboard')
      }
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
        enableReinitialize
        initialValues={{
          description: formValue.description || '',
          subHeader: formValue.subHeader || '',
          subDescription: formValue.subDescription || '',
          image: null,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          description: Yup.string().required('Description is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            const formData = new FormData();
            formData.append('description', values.description);

              await api.put(`about-us`, 
                formData
              ,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${userToken}`
                }
              });
            
            getAboutUs()
            
            toast.success(`About us updated successfully`, {
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
        {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Stack spacing={1}>
                <InputLabel htmlFor="description">Description (*)</InputLabel>
                <RichTextEditor
                  name="description"
                  value={values.description}
                  onChange={setFieldValue}
                />
                 {touched.description && errors.description && (
                    <FormHelperText error id="standard-weight-helper-text-description-login">
                      {errors.description}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

             
              
              { userDetails?.accessModuleData.includes("Add-about-us") &&
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Update About Us
                    </Button>
                  </AnimateButton>
                </Grid>
              }
            </Grid>
          </form>
        )}
      </Formik>
      </Box>
     }
    </Paper>
  );
};

export default AboutUsPage;
