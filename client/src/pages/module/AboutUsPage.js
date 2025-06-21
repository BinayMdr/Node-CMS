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
import RichTextEditor from 'pages/components-overview/RichTextEditor';

const AboutUsPage = () => {

  const [formValue, setFormValue] = React.useState({"name":"","pan":""})
  const [imagePreview, setImagePreview] = React.useState(null);


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

      if (convertedObject.image) {
        setImagePreview(`${process.env.REACT_APP_IMAGE_BASE_URL}${convertedObject.image}`);
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
    getAboutUs()
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
          description: Yup.string().max(255).required('Description is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            const formData = new FormData();
            formData.append('description', values.description);
            formData.append('subHeader', values.subHeader);
            formData.append('subDescription', values.subDescription);

            if (values.image) {
              formData.append('image', values.image);
            }
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
            console.log(err)
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

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="subHeader">Sub Header</InputLabel>
                  <OutlinedInput
                    id="subHeader"
                    type="text"
                    value={values.subHeader}
                    name="subHeader"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter sub header"
                    fullWidth
                    error={Boolean(touched.subHeader && errors.subHeader)}
                  />
                  {touched.subHeader && errors.subHeader && (
                    <FormHelperText error id="standard-weight-helper-text-subHeader-login">
                      {errors.subHeader}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              
              <Grid item xs={6}>
                <Stack spacing={1}>
                <InputLabel htmlFor="subDescription">Sub Description</InputLabel>
                <RichTextEditor
                  name="subDescription"
                  value={values.subDescription}
                  onChange={setFieldValue}
                />
                </Stack>
              </Grid>
              

               <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="image">Image</InputLabel>

                  {values.image ? (
                    <Box mt={2}>
                      <img
                        src={
                          typeof values.image === 'string'
                            ? `${process.env.REACT_APP_IMAGE_BASE_URL}${values.image}` // DB image
                            : URL.createObjectURL(values.image) // New upload
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
                    id="image"
                    type="file"
                    name="image"
                    inputProps={{ accept: 'image/*' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue('image', file);
                    }}
                    fullWidth
                    error={Boolean(touched.image && errors.image)}
                  />
                  {touched.image && errors.image && (
                    <FormHelperText error id="standard-weight-helper-text-image">
                      {errors.image}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Update About Us
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

export default AboutUsPage;
