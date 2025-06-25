import * as React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Typography, Button, Box, Modal,
  Grid, Stack, InputLabel, FormHelperText, OutlinedInput,FormControlLabel, Checkbox
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Divider from '@mui/material/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'is_enabled', label: 'Status', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

const FoodCategoryPage = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData, setTotalData] = React.useState(0);
  const [formValue, setFormValue] = React.useState({ id: null, name: '', price: 0, status: false });
  const [formAction, setFormAction] = React.useState('Add');
  const [draggedRowIndex, setDraggedRowIndex] = React.useState(null);

  const userToken = localStorage.getItem('token');

  const getFoodCategory = async (page, pageSize, search) => {
    try {
      const response = await api.get('food-category', {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { filter: search, pageSize, page: page + 1 }
      });
      setRows(response.data.data);
      setTotalData(response.data.pageInfo.totalData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFoodCategory(page, rowsPerPage, searchValue);
  }, [page, rowsPerPage, searchValue]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeSearch = (event) => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  const addUser = () => {
    setFormAction('Add');
    setFormValue({ id: null, name: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: '30px',
  };

  const handleViewUpdate = (action, id) => {
    setFormAction(action);
    const item = rows.find((element) => element.id === id);
    if (item) {
      setFormValue({
        id,
        name: item.name,
        status: item.is_active,
      });
      setOpen(true);
    }
  };

  const handleDragStart = (event, index) => {
    setDraggedRowIndex(index);
  };

  const handleDragOver = (event, index) => {
    console.log(index)
    event.preventDefault();
  };

  const handleDrop = async (event, dropIndex) => {
  event.preventDefault();
    if (draggedRowIndex === null || draggedRowIndex === dropIndex) return;

    const updatedRows = [...rows];
    const [draggedRow] = updatedRows.splice(draggedRowIndex, 1);
    updatedRows.splice(dropIndex, 0, draggedRow);

    setRows(updatedRows);
    setDraggedRowIndex(null);

    try
    {
      const response = await api.put("food-category/reorder", {
        foodCategories: updatedRows,
        page: page,
        pageSize: rowsPerPage
      },{
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
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
    }
    catch(err)
    {
      console.log(err)
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
  };

  console.log(rows)
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ToastContainer />
      <TextField
        id="outlined-search"
        type="search"
        placeholder="Search"
        sx={{ my: 1, mx: 1, float: 'right' }}
        value={searchValue}
        onChange={handleChangeSearch}
      />
      <Button variant="contained" sx={{ my: 1, float: 'right' }} onClick={addUser}>
        <PlusOutlined /> <span style={{ marginLeft: '5px' }}>Add</span>
      </Button>
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                draggable= {searchValue === ''}
                onDragStart={searchValue === '' ? (e) => handleDragStart(e, index) : undefined}
                onDragOver={searchValue === '' ? (e) => handleDragOver(e, index) : undefined}
                onDrop={searchValue === '' ? (e) => handleDrop(e, index) : undefined}
                sx={{ cursor: 'move' }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id}>
                      {/* your existing column render logic here */}
                      {column.id === 'review'
                        ? row.review.length > 30
                          ? `${row.review.slice(0, 30)}...`
                          : row.review
                        : column.id === 'is_enabled'
                        ? value
                          ? 'Active'
                          : 'Inactive'
                        : column.id === 'action'
                        ? (
                          <>
                            <Button onClick={() => handleViewUpdate("View", row.id)}><EyeOutlined /></Button>
                            <Button><EditOutlined onClick={() => handleViewUpdate("Edit", row.id)} /></Button>
                          </>
                        )
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))} 
          </TableBody>


        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
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
          {formAction} Food Category
        </Typography>
        <Divider sx={{my:2}}/>
        <Formik
        initialValues={{
          name: formValue.name,
          status:formValue.status,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            let message = "added"
            if( formAction == "Add")
            {
              await api.post("food-category", {
                name: values.name,
                status: values.status ? true : false
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
                status: values.status ? true : false
              };
              
              await api.put(`food-category/edit/${formValue.id}`, formData ,{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              message = "updated"
            }
            
            setOpen(false)
            getFoodCategory(page,rowsPerPage,searchValue)
            
            toast.success(`Food category ${message} successfully`, {
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
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
                      {formAction == "Edit" ? "Update" : formAction} Food Category
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

export default FoodCategoryPage;
