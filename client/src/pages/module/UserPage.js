import * as React from 'react';
import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput,Checkbox, FormControlLabel, Select, MenuItem
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
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'branch_id', label: 'Branch', minWidth: 170 },
  { id: 'is_active', label: 'Status', minWidth: 100},
  { id: 'action', label: 'Action', minWidth: 100},
];

const UserPage = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);

  const [formValue, setFormValue] = React.useState({"id":null,"name":"",
              "price":0,"status":false})

  const [formAction, setFormAction] = React.useState('Add');
  const [branchList,setBranchList] = React.useState([]);

  const userToken = localStorage.getItem('token');

  const getBranchList = async () => {
    try
    {
      const response = await api.get('branch/get-list', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      setBranchList(response.data.data)
      
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  const getUser = async (page,pageSize,search) => {
    try
    {
      const response = await api.get('user', {
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
      getUser(page,rowsPerPage,searchValue)
  },[page,rowsPerPage,searchValue])

  useEffect( () => {
    getBranchList()
  },[])
  
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

  const addUser = () => {
    setFormAction("Add")
    setFormValue({
      "id":null,
      "name":"",
      "email":"",
      "branch":"",
      "status":false,
      "password":"",
      "confirmPassword":""
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
        let branchId = element['branch_id'];

        if(action == "Edit" && element['Branch']['is_enabled'] == false) 
        {
          branchId = '';
        }
        setFormValue({
          "id":id,
          "name":element['name'],
          "email":element['email'],
          "status":element['is_active'],
          "branch": branchId,
          "password":"",
          "confirmPassword":""
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
          onClick={addUser}
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
                          { (column.id === "name" || column.id === "email") ? (column.format && typeof value === 'number'
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
          email: formValue.email,
          branch: formValue.branch,
          status:formValue.status,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          branch: Yup.string().max(255).required('Branch is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

            let message = "added";
            if( formAction == "Add")
            {
              let message = '';
              if(values.password.length < 6) message = "Password length must be equal or greater than 6 digits"
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
              await api.post("user", {
                name: values.name,
                email: values.email,
                branch_id: values.branch,
                is_active: values.status,
                password: values.password
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            }
            else
            {
              let formData = {
                branch_id: values.branch,
                is_active: values.status
              };
              if(values.password != '')
              {
                let message = '';
                if(values.password.length < 6) message = "Password length must be equal or greater than 6 digits"
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
                formData.password = values.password
              }

              await api.put(`user/edit/${formValue.id}`, formData ,{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              message = "updated"
            }

            setOpen(false)
            getUser(page,rowsPerPage,searchValue)
            
            toast.success(`User ${message} successfully`, {
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values ,setFieldValue}) => (
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
                    readOnly={formAction == "View" || formAction == "Edit"}
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
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="text"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    readOnly={formAction == "View" || formAction == "Edit"}
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
                  <InputLabel htmlFor="branch">Branch</InputLabel>
                   <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.branch}
                      onChange={(event) => {
                        handleChange(event);
                        setFieldValue('branch', event.target.value);
                      }}
                      disabled={ formAction == "View"}
                    >
                      {
                        branchList.map((branch) => {
                        const { id, name , is_enabled} = branch;
                        return (
                          <MenuItem key={id} value={id} disabled={ !is_enabled }>
                            {name}
                          </MenuItem>
                        );
                        })
                      }
                    </Select>

                  {touched.branch && errors.branch && (
                    <FormHelperText error id="standard-weight-helper-text-branch-login">
                      {errors.branch}
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
              { (formAction == 'Add' || formAction == 'Edit') &&
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      type="password"
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter password"
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      readOnly={formAction == "View"}
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              }
              {
                (formAction == 'Add' || formAction == 'Edit') &&
                <Grid item xs={6}>
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
                      readOnly={formAction == "View"}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText error id="standard-weight-helper-text-confirmPassword-login">
                        {errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              }
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              { (formAction != "View") &&
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      {formAction == "Edit" ? "Update" : formAction} User
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

export default UserPage;
