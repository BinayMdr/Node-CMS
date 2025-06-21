import * as React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Typography, Button, Box, Modal,
  Grid, Stack, InputLabel, FormHelperText, OutlinedInput, Rating,
  FormControlLabel, Checkbox
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
  { id: 'designation', label: 'Designation', minWidth: 100 },
  { id: 'review', label: 'Review', minWidth: 100 },
  { id: 'is_enabled', label: 'Status', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

const CustomerReviewPage = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData, setTotalData] = React.useState(0);
  const [formValue, setFormValue] = React.useState({ id: null, name: '', price: 0, status: false });
  const [formAction, setFormAction] = React.useState('Add');

  const userToken = localStorage.getItem('token');

  const getMessage = async (page, pageSize, search) => {
    try {
      const response = await api.get('customer-review', {
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
    getMessage(page, rowsPerPage, searchValue);
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
    setFormValue({ id: null, name: '', designation: '', review: '', ratings: 0 });
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
        designation: item.designation,
        review: item.review,
        ratings: item.ratings,
        status: item.is_active,
      });
      setOpen(true);
    }
  };

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
            {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                            { (column.id === "name" || column.id === "designation") 
                                ? (column.format && typeof value === 'number' ? column.format(value) : value) 
                                : (column.id === "review" 
                                    ? (row.review.length > 30 ? `${row.review.slice(0, 30)}...` : row.review)
                                    : (column.id === "is_enabled" 
                                        ? (value === true ? 'Active' : 'Inactive') 
                                        : (
                                        <span>
                                            <Button onClick={() => handleViewUpdate("View", row.id)}>
                                            <EyeOutlined />
                                            </Button>
                                             <Button>
                                                <EditOutlined onClick={() => handleViewUpdate("Edit",row.id)}/></Button>
                                        </span>
                                        )
                                    )
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
          {formAction} Customer Review
        </Typography>
        <Divider sx={{my:2}}/>
        <Formik
        initialValues={{
          name: formValue.name,
          designation: formValue.designation,
          review: formValue.review,
          ratings:formValue.ratings,
          status:formValue.status,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          designation: Yup.string().max(255).required('Designation is required'),
          review: Yup.string().max(255).required('Review is required'),
          ratings: Yup.string().max(255).required('Ratings is required'),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            let message = "added"
            if( formAction == "Add")
            {
              await api.post("customer-review", {
                name: values.name,
                designation: values.designation,
                review: values.review,
                ratings: values.ratings,
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
                designation: values.designation,
                review: values.review,
                ratings: values.ratings,
                status: values.status ? true : false
              };
              
              await api.put(`customer-review/edit/${formValue.id}`, formData ,{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              message = "updated"
            }
            
            setOpen(false)
            getMessage(page,rowsPerPage,searchValue)
            
            toast.success(`Customer review ${message} successfully`, {
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
                <Stack spacing={1}>
                  <InputLabel htmlFor="designation">Designation (*)</InputLabel>
                  <OutlinedInput
                    id="designation"
                    type="text"
                    value={values.designation}
                    name="designation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    fullWidth
                    error={Boolean(touched.designation && errors.designation)}
                    readOnly={formAction == "View"}
                  />
                  {touched.designation && errors.designation && (
                    <FormHelperText error id="standard-weight-helper-text-designation-login">
                      {errors.designation}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="ratings">Ratings (*)</InputLabel>
                  <Rating
                    id="ratings"
                    name="ratings"
                    value={Number(values.ratings)}
                    precision={1}
                    max={5}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: { name: 'ratings', value: newValue }
                      });
                    }}
                    readOnly={formAction === "View"}
                  />
                  {touched.ratings && errors.ratings && (
                    <FormHelperText error id="standard-weight-helper-text-ratings-login">
                      {errors.ratings}
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
                    <InputLabel htmlFor="review">Review (*)</InputLabel>
                    <TextField
                    id="review"
                    name="review"
                    value={values.review}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter review"
                    fullWidth
                    multiline
                    minRows={3} 
                    error={Boolean(touched.review && errors.review)}
                    InputProps={{
                        readOnly: formAction === "View"
                    }}
                    />
                    {touched.review && errors.review && (
                    <FormHelperText error id="standard-weight-helper-text-review-login">
                        {errors.review}
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
                      {formAction == "Edit" ? "Update" : formAction} Customer Review
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

export default CustomerReviewPage;
