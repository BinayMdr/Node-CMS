import * as React from 'react';
import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput,Checkbox, FormControlLabel, Autocomplete, Chip
      } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import {EditOutlined,EyeOutlined,PlusOutlined} from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Divider from '@mui/material/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HistoryIcon from '@mui/icons-material/History';
const columns = [
  { id: 'model_id', label: 'Model Id', minWidth: 170 },
  { id: 'name', label: 'Product Name', minWidth: 170 },
  { id: 'price', label: 'Price', minWidth: 100},
  { id: 'quantity', label: 'Stock', minWidth: 100},
  { id: 'action', label: 'Action', minWidth: 100},
];

const ProductPage = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);

  const [formValue, setFormValue] = React.useState({"id":null,"model_id":"","name":"",
              "price":0,"status":false})
  
  const [imagePreview, setImagePreview] = React.useState(null);

  const [formAction, setFormAction] = React.useState('Add');

  const userToken = localStorage.getItem('token');


  const getProduct = async (page,pageSize,search) => {
    try
    {
      const response = await api.get('product', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          filter: search,
          pageSize: pageSize,
          page: page + 1
        }
      });

      setRows(response.data.data)
      setTotalData(response.data.pageInfo.totalData)
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  useEffect( () => {
      getProduct(page,rowsPerPage,searchValue)
  },[page,rowsPerPage,searchValue])
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const addProduct = () => {
    setFormAction("Add")
    setFormValue({
      "id":null,
      "name":"",
      "price":0,
      "model_id":"",
      "status":false
    })
    setOpen(true)
    setImagePreview(null)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: '30px',
    overflowY: 'auto',
    maxHeight: '90vh',
  };

  const handleViewUpdate = (action,id) =>{
    setFormAction(action)
    
    rows.find(function(element){
      if(element['id'] == id)
      {
        setFormValue({
          "id":id,
          "name":element['name'],
          "price":element['price'],
          "status":element['is_enabled'],
          "model_id":element['model_id']
        })

        if (element['image']) {
          const backendUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}`;
          const imageUrl = backendUrl + element['image'];
          setImagePreview(imageUrl);
        } else {
          setImagePreview(null);
        }
      }
    });
    setOpen(true)
  }

  const getStockLevel = (quantity) =>{
    
    if (quantity < 1) {
    return { label: 'Finished', color: 'red' };
    } else if (quantity < 5) {
      return { label: 'Low', color: 'yellow' };
    } else {
      return { label: 'Good', color: 'green' };
    }
  }
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ToastContainer></ToastContainer>
          <Autocomplete
            freeSolo
            id="product-search"
            disableClearable
            sx={{
              '& .MuiInputBase-root': {
                padding: '0 8px',
                marginTop: '6px'
              }
            }}
            options={rows.filter(model_id => model_id !== null && model_id !== undefined && model_id !== '')
              .map((formValue) => formValue.model_id+ '('+ formValue.name + ')')        
            } 
            onInputChange={(event, newInputValue) => {
              setSearchValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search"
                sx={{ my: 0.5, mx: 1, float: 'right', width: 200,paddingBottom:'10px'}}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />


        <Button variant="contained"
          sx={{my:1,float:'right'}}
          onClick={addProduct}
         ><PlusOutlined /> <span style={{marginLeft:'5px'}}>Add</span></Button>
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {
                            (column.id === "name" || column.id === "price" || column.id === "model_id") ? (
                              column.format && typeof value === 'number'
                                ? column.format(value)
                                : value
                            ) :
                            (column.id === "is_enabled") ? (
                              value === true ? 'Active' : 'Inactive'
                            ) :
                            (column.id === "quantity" ? (() => {
                              const level = getStockLevel(value);
                              return (
                                
                                <Chip label={`${level.label} - ${value}`} 
                                sx={{
                                  backgroundColor: level.color,
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  borderRadius: '8px',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                  px: 1.5,
                                  py: 0.5,
                                  fontSize: '0.875rem',
                                  minWidth: '80px',
                                  textAlign: 'center'
                                }} /> 
                                  
                              );
                            })() : (
                              <span>
                                <Button onClick={() => handleViewUpdate("View", row.id)}>
                                  <EyeOutlined />
                                </Button>
                                <Button onClick={() => handleViewUpdate("Edit", row.id)}>
                                  <EditOutlined />
                                </Button>
                                <Button onClick={() => handleViewUpdate("Edit", row.id)}>
                                  <HistoryIcon />
                                </Button>
                              </span>
                            ))
                          }
                        </TableCell>

                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10,25, 50, 100]}
        component="div"
        count={totalData}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h2" component="h2" sx={{textAlign:'center'}}>
          {formAction} Product
        </Typography>
        <Divider sx={{my:2}}/>
        <Formik
        initialValues={{
          name: formValue.name,
          price:formValue.price,
          status:formValue.status,
          model_id:formValue.model_id,
          image:null,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          model_id: Yup.string().max(255).required('Model Id is required'),
          price: Yup.number().required('Price is required').positive('Price must be positive')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

            let message = "added";
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('price', values.price);
            formData.append('is_enabled', values.status);
            formData.append('model_id', values.model_id);
            if (values.image) {
              formData.append('image', values.image);
            }

            if( formAction == "Add")
            {
              await api.post("product", formData,{
                headers: {
                  'Authorization': `Bearer ${userToken}`,
                   'Content-Type': 'multipart/form-data'
                }
              });
            }
            else
            {
              await api.put(`product/edit/${formValue.id}`, formData,{
                headers: {
                  'Authorization': `Bearer ${userToken}`,
                   'Content-Type': 'multipart/form-data'
                }
              });
              message = "updated"
            }

            setOpen(false)
            getProduct(page,rowsPerPage,searchValue)
            
            toast.success(`Product ${message} successfully`, {
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="modelId">Model Id</InputLabel>
                  <OutlinedInput
                    id="Model Id"
                    type="text"
                    value={values.model_id}
                    name="model_id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter model id"
                    fullWidth
                    error={Boolean(touched.model_id && errors.model_id)}
                    readOnly={formAction == "View"}
                  />
                  {touched.model_id && errors.model_id && (
                    <FormHelperText error id="standard-weight-helper-text-model_id-login">
                      {errors.model_id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name">Name</InputLabel>
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
                    readOnly={formAction == "View"}
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
                  <InputLabel htmlFor="price">Price</InputLabel>
                  <OutlinedInput
                    id="price"
                    type="number"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter price"
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                    readOnly={formAction == "View"}
                  />
                  {touched.price && errors.price && (
                    <FormHelperText error id="standard-weight-helper-text-price-login">
                      {errors.price}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="status"
                        value={values.status}
                        name="status"
                        onChange={handleChange}
                        checked={values.status}
                        disabled={formAction == "View"}
                      />
                    }
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="image">Product Image</InputLabel>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ marginTop: '10px', maxWidth: '50%', height: '50%', borderRadius: 8 }}
                    />
                  )}

                  <OutlinedInput
                    id="image"
                    type="file"
                    name="image"
                    inputProps={{ accept: 'image/jpeg, image/jpg, image/png' }}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue('image',file)
                      handleChange({
                        target: {
                          name: 'image',
                          value: file
                        }
                      });

                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    fullWidth
                  />
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              { (formAction != "View") &&
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      {formAction == "Edit" ? "Update" : formAction} Product
                    </Button>
                  </AnimateButton>
                </Grid>
              }
            </Grid>
          </form>
        )}
      </Formik>
      </Box>
    </Modal>

    </Paper>
  );
};

export default ProductPage;
