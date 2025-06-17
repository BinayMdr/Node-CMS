import * as React from 'react';
import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput
      } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import {EditOutlined,EyeOutlined} from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Divider from '@mui/material/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'phone_number', label: 'Phone Number', minWidth: 170 },
  { id: 'action', label: 'Action', minWidth: 100},
];

const CustomerPage = () => {

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

  const getCustomer = async (page,pageSize,search) => {
    try
    {
      const response = await api.get('customer', {
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
      getCustomer(page,rowsPerPage,searchValue)
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
  };

  const handleViewUpdate = (action,id) =>{
    setFormAction(action)
    
    rows.find(function(element){
      if(element['id'] == id)
      {
        setFormValue({
          "id":id,
          "name":element['name'],
          "phone_number":element['phone_number']
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
                          { (column.id === "name" || column.id === "phone_number") ? (column.format && typeof value === 'number'
                            ? column.format(value)
                            : value) :( (column.id == "branch_id") ? ( row.Branch.is_enabled ? `${row.Branch.name}` : `${row.Branch.name} (Inactive)`) 
                            :
                            ((column.id == "is_active") ? (value === true ? 'Active' : 'Inactive') 
                            : <span>
                                <Button onClick={() => handleViewUpdate("View",row.id)}>
                                    <EyeOutlined/></Button>  
                                <Button>
                                    <EditOutlined onClick={() => handleViewUpdate("Edit",row.id)}/></Button>
                              </span>)
                            )
                            
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
          {formAction} User
        </Typography>
        <Divider sx={{my:2}}/>
        <Formik
        initialValues={{
          name: formValue.name,
          phone_number: formValue.phone_number,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          phone_number: Yup.string().max(255).required('Phone number is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

            let message = "added";
            if( formAction == "Add")
            {
              await api.post("customer", {
                name: values.name,
                phone_number: values.phone_number
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            }
            else
            {
              let formData = {
                name: values.name,
                phone_number: values.phone_number
              };
              

              await api.put(`customer/edit/${formValue.id}`, formData ,{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              message = "updated"
            }

            setOpen(false)
            getCustomer(page,rowsPerPage,searchValue)
            
            toast.success(`Customer ${message} successfully`, {
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
                  <InputLabel htmlFor="phonenumber">Phone Number</InputLabel>
                  <OutlinedInput
                    id="phonenumber"
                    type="text"
                    value={values.phone_number}
                    name="phone_number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    fullWidth
                    error={Boolean(touched.phone_number && errors.phone_number)}
                    readOnly={formAction == "View"}
                  />
                  {touched.phone_number && errors.phone_number && (
                    <FormHelperText error id="standard-weight-helper-text-phone_number-login">
                      {errors.phone_number}
                    </FormHelperText>
                  )}
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
                      {formAction == "Edit" ? "Update" : formAction} Customer
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

export default CustomerPage;
