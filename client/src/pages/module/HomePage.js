import * as React from 'react';
import {
  Paper,
  Button,
  Box,
  Grid,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const userDetails = useSelector((state => state.userDetails));
  const navigate = useNavigate();
  const [formValue, setFormValue] = React.useState({ name: '', pan: '' });
  const [imagePreviews, setImagePreviews] = React.useState({});
  const [showData, setShowData] = React.useState(false);
  const userToken = localStorage.getItem('token');

  const getHome = async () => {
    try {
      const response = await api.get('home');
      const pluckedData = response.data.data.map(({ name, value }) => ({ name, value }));
      const convertedObject = pluckedData.reduce((result, { name, value }) => {
        result[name] = value;
        return result;
      }, {});

      setImagePreviews({
        image1: convertedObject.image1 ? `${process.env.REACT_APP_IMAGE_BASE_URL}${convertedObject.image1}` : null,
        image2: convertedObject.image2 ? `${process.env.REACT_APP_IMAGE_BASE_URL}${convertedObject.image2}` : null,
        image3: convertedObject.image3 ? `${process.env.REACT_APP_IMAGE_BASE_URL}${convertedObject.image3}` : null
      });

      setFormValue(convertedObject);
      setShowData(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHome();
  }, []);

  useEffect( () => {
      if(!userDetails?.accessModuleData.includes("View-home")){
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
      <ToastContainer />
      {showData && (
        <Box sx={style}>
          <Formik
            enableReinitialize
            initialValues={{
              image1: null,
              image1Title: formValue.image1Title || '',
              image1Description: formValue.image1Description || '',
              image2: null,
              image2Title: formValue.image2Title || '',
              image2Description: formValue.image2Description || '',
              image3: null,
              image3Title: formValue.image3Title || '',
              image3Description: formValue.image3Description || '',
              specialDishes: formValue.specialDishes || '',
              expertChefs: formValue.expertChefs || '',
              eventHosted: formValue.eventHosted || '',
              happyCustomers: formValue.happyCustomers || '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                const formData = new FormData();
                formData.append('image1Title', values.image1Title);
                formData.append('image1Description', values.image1Description);
                formData.append('image2Title', values.image2Title);
                formData.append('image2Description', values.image2Description);
                formData.append('image3Title', values.image3Title);
                formData.append('image3Description', values.image3Description);

                formData.append('specialDishes', values.specialDishes);
                formData.append('expertChefs', values.expertChefs);
                formData.append('eventHosted', values.eventHosted);
                formData.append('happyCustomers', values.happyCustomers);

                if (values.image1) formData.append('image1', values.image1);
                if (values.image2) formData.append('image2', values.image2);
                if (values.image3) formData.append('image3', values.image3);

                await api.put(`home`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userToken}`
                  }
                });

                getHome();
                toast.success('Home page updated successfully');
              } catch (err) {
                setStatus({ success: false });
                setSubmitting(false);
                if (err.response?.status === 400) {
                  toast.error(err.response.data.message);
                }
              }
            }}
          >
            {({ handleChange,  handleSubmit,values, setFieldValue, isSubmitting }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {[1, 2, 3].map((i) => (
                    <React.Fragment key={i}>
                      <Grid item xs={12} sm={4}>
                        <InputLabel>{`Image ${i}`}</InputLabel>
                        {values[`image${i}`] ? (
                          <Box mt={1}>
                            <img
                              src={URL.createObjectURL(values[`image${i}`])}
                              alt={`Preview ${i}`}
                              style={{ width: '100%', maxWidth: '200px', border: '1px solid #ccc', borderRadius: '8px' }}
                            />
                          </Box>
                        ) : imagePreviews[`image${i}`] ? (
                          <Box mt={1}>
                            <img
                              src={imagePreviews[`image${i}`]}
                              alt={`Preview ${i}`}
                              style={{ width: '100%', maxWidth: '200px', border: '1px solid #ccc', borderRadius: '8px' }}
                            />
                          </Box>
                        ) : null}

                        <OutlinedInput
                          type="file"
                          name={`image${i}`}
                          inputProps={{ accept: 'image/*' }}
                          onChange={(e) => setFieldValue(`image${i}`, e.target.files[0])}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputLabel>{`Image ${i} Title`}</InputLabel>
                        <OutlinedInput
                          name={`image${i}Title`}
                          value={values[`image${i}Title`]}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputLabel>{`Image ${i} Description`}</InputLabel>
                        <OutlinedInput
                          name={`image${i}Description`}
                          value={values[`image${i}Description`]}
                          onChange={handleChange}
                          fullWidth
                          multiline
                          minRows={6}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}

                  <Grid item xs={12} sm={3}>
                    <InputLabel>Special Dishes</InputLabel>
                    <OutlinedInput
                      name="specialDishes"
                      value={values.specialDishes}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel>Expert Chefs</InputLabel>
                    <OutlinedInput
                      name="expertChefs"
                      value={values.expertChefs}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel>Event Hosted</InputLabel>
                    <OutlinedInput
                      name="eventHosted"
                      value={values.eventHosted}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel>Happy Customers</InputLabel>
                    <OutlinedInput
                      name="happyCustomers"
                      value={values.happyCustomers}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  { userDetails?.accessModuleData.includes("Add-home") &&
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                        Update Home Page
                      </Button>
                    </AnimateButton>
                  </Grid>
                  }
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      )}
    </Paper>
  );
};

export default HomePage;
