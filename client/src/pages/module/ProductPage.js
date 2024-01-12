import * as React from 'react';
import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput,Checkbox, FormControlLabel
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

const columns = [
  { id: 'name', label: 'Product Name', minWidth: 170 },
  { id: 'price', label: 'Price', minWidth: 100},
  { id: 'is_enabled', label: 'Status', minWidth: 100},
  { id: 'action', label: 'Action', minWidth: 100},
];

const ProductPage = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);

  const [formValue, setFormValue] = React.useState({"id":null,"name":"",
              "price":0,"status":false})

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

  const handleChangeSearch = (event) => {
    setSearchValue(event.target.value)
    setPage(0)
  }

  const addProduct = () => {
    setFormAction("Add")
    setFormValue({
      "id":null,
      "name":"",
      "price":0,
      "status":false
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
  };

  const handleViewUpdate = (action,id) =>{
    setFormAction(action)
    
    rows.find(function(element){
      if(element['id'] == id)
      {
        console.log(element['price'])
        setFormValue({
          "id":id,
          "name":element['name'],
          "price":element['price'],
          "status":element['is_enabled']
        })
      }
    });
    setOpen(true)

  }
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ToastContainer></ToastContainer>
        <TextField id="outlined-search" type="search" placeholder="Search" 
              sx={{my:1,mx:1,float:'right'}}
              value={searchValue}
              onChange={handleChangeSearch}/>
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
                          { (column.id === "name" || column.id === "price") ? (column.format && typeof value === 'number'
                            ? column.format(value)
                            : value) : 
                            
                            ((column.id == "is_enabled") ? (value === true ? 'Active' : 'Inactive') 
                            : <span>
                                <Button onClick={() => handleViewUpdate("View",row.id)}>
                                    <EyeOutlined/></Button>  
                                <Button>
                                    <EditOutlined onClick={() => handleViewUpdate("Edit",row.id)}/></Button>
                              </span>)
                            
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
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          price: Yup.number().required('Price is required').positive('Price must be positive')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

            let message = "added";
            if( formAction == "Add")
            {
              await api.post("product", {
                name: values.name,
                price: values.price,
                is_enabled: values.status
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            }
            else
            {
              await api.put(`product/edit/${formValue.id}`, {
                name: values.name,
                price: values.price,
                is_enabled: values.status
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="standard-weight-helper-text-name-login">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
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
