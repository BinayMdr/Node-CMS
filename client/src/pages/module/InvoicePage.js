import * as React from 'react';
import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput,Select, MenuItem
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
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { id: 'invoice_number', label: 'Invoice No.', minWidth: 100 },
  { id: 'customer_name', label: 'Customer Name', minWidth: 150 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 80},
  { id: 'preparedBy', label: 'Prepared by', minWidth: 100 },
  { id: 'createdAt', label: 'Ordered Time', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 60},
];

const InvoicePage = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [startDateValue, setStartDateValue] = React.useState('');
  const [endDateValue, setEndDateValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);
  

  const [subTotal,setSubTotal] = React.useState(0);
  const [total,setTotal] = React.useState(0);
  const [discount,setDiscount] = React.useState(0);
  const [formValue, setFormValue] = React.useState({"id":null,"customerName":"","invoiceNumber":""});
  const [invoiceList, setInvoiceList] = React.useState([]);

  const [formAction, setFormAction] = React.useState('Add');
  const [productList,setProductList] = React.useState([]);

  const userToken = localStorage.getItem('token');

  const getProductList = async () => {
    try
    {
      const response = await api.get('product/get-list', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      setProductList(response.data.data)
      
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  const getInvoice = async (page,pageSize,search,starDate,endDate) => {
    try
    {
      const response = await api.get('invoice', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          filter: search,
          pageSize: pageSize,
          page: page + 1,
          startDate: starDate,
          endDate: endDate
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
      getInvoice(page,rowsPerPage,searchValue,startDateValue,endDateValue)
  },[page,rowsPerPage,searchValue,startDateValue,endDateValue])

  useEffect( () => {
    getProductList()
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

  const handleChangeStartDate = (event) => {
    setStartDateValue(event.target.value)
    setPage(0)
  }

  const handleChangeEndDate = (event) => {
    setEndDateValue(event.target.value)
    setPage(0)
  }

  const handleClearDate = () => {
    setStartDateValue('')
    setEndDateValue('')
  }

  const addItemToInvoice = (productId) => {
    const selectedProduct = productList.find(product => product.id === productId);

    const updatedInvoiceList = [...invoiceList,{"id":productId,"name":selectedProduct['name'],
              "quantity":1,"price":selectedProduct['price'],"total":selectedProduct['price']}];
    setInvoiceList(updatedInvoiceList)
    updateTotalPrice(updatedInvoiceList)
  } 

  const removeItemFromInvoice = (id) => {
    const updatedInvoiceList = invoiceList.filter(invoice => invoice.id !== id)
    setInvoiceList(updatedInvoiceList)
    updateTotalPrice(updatedInvoiceList)
  }

  const updateQuantity = (event,id) => {
    const newQuantity = parseInt(event.target.value,10);

    if(isNaN(newQuantity) || newQuantity < 1) return false;

    const quantity = event.target.value;

    const updatedItems = invoiceList.map(item => {
      if (item.id === id) {
        return { ...item, quantity: quantity, total: quantity * item.price };
      }
      return item;
    });

    setInvoiceList(updatedItems)
    updateTotalPrice(updatedItems)
  } 

  const updateTotalPrice = (itemLists) => {
    
    const itemsTotal = itemLists.reduce((sum,item) => sum + item.total,0);
    setSubTotal(itemsTotal)

    let newTotal = 0;
    if(discount != 0)
    {
      newTotal = itemsTotal - (discount/100) * itemsTotal;

      setTotal(newTotal)
    }
    else
    {
      setTotal(itemsTotal)
    }
  }

  const updateDiscount = (event) => {
    const newDiscount = parseInt(event.target.value,10);

    if(isNaN(newDiscount) || newDiscount < 1) return false;

    setDiscount(event.target.value)

    const itemsTotal = invoiceList.reduce((sum,item) => sum + item.total,0);
    setSubTotal(itemsTotal)

    let newTotal = 0;
    if(event.target.value != 0)
    {
      newTotal = itemsTotal - (newDiscount/100) * itemsTotal;

      setTotal(newTotal)
    }
    else
    {
      setTotal(itemsTotal)
    }
  }
  const addInvoice = () => {
    setFormAction("Add")
    setFormValue({
      "id":null,
      "customerName":"",
      "invoiceNumber":""
    })

    setSubTotal(0)
    setTotal(0)
    setDiscount(0)

    setInvoiceList([])

    setOpen(true)
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
    p: '30px', overflowY:'auto',maxHeight:'600px'
  };

  console.log(formValue)
  const handleViewUpdate = (action,id) =>{
    setFormAction(action)
    
    rows.find(function(element){
      if(element['id'] == id)
      {
        setFormValue({
          "id":id,
          "customerName":element['customer_name'],
          "invoiceNumber":element['invoice_number']
        })

        setSubTotal(element['sub_total'])
        setTotal(element['total'])
        setDiscount(element['discount_percent'])

        setInvoiceList(element['products'])
      }
    });
    setOpen(true)

  }

  const formatDate = (date) => {
    let splitDate = new Date(date).toISOString().split('T')[0];
    return splitDate
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
          onClick={addInvoice}
         ><PlusOutlined /> <span style={{marginLeft:'5px'}}>Add</span></Button>
         
         <Button variant="contained"
          sx={{my:1,mx:1,float:'right',backgroundColor:'red',
          '&:hover': {
            backgroundColor: 'darkred',
          },

        }}
          onClick={handleClearDate}
         >Clear</Button>

         <TextField id="outlined-search" type="date" placeholder="End Date" 
              sx={{my:1,mx:1,float:'right'}}
              value={endDateValue}
              onChange={handleChangeEndDate}/>
          <Typography variant="h5" component="h2" sx={{my:2,mx:1,float:'right'}} >End Date</Typography>
          <TextField id="outlined-search" type="date" placeholder="Start Date" 
              sx={{my:1,mx:1,float:'right'}}
              value={startDateValue}
              onChange={handleChangeStartDate}/>
          <Typography variant="h5" component="h2" sx={{my:2,mx:1,float:'right'}} >Start Date</Typography>
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
                          { ( ["invoice_number","customer_name","status","preparedBy"].includes(column.id)) ? (column.format && typeof value === 'number'
                            ? column.format(value)
                            : value) :( (column.id == "branch_id") ? ( row.Branch.is_enabled ? `${row.Branch.name}` : `${row.Branch.name} (Inactive)`) 
                            :
                            ((column.id == "total") ? "Rs. " + row.total 
                            : 
                            ( (column.id == "createdAt") ? formatDate(row.createdAt)
                            :
                            <span>
                                <Button onClick={() => handleViewUpdate("View",row.id)}>
                                    <EyeOutlined/></Button>  
                                <Button>
                                    <EditOutlined onClick={() => handleViewUpdate("Edit",row.id)}/></Button>
                              </span>))
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
          {formAction} Invoice { (formValue.invoiceNumber != "") ? "("+(formValue.invoiceNumber)+")" : '' }
        </Typography>
        <Divider sx={{my:2}}/>
        <Formik
        initialValues={{
          customerName: formValue.customerName,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          customerName: Yup.string().max(255).required('Customer Name is required')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

            console.log('here')
            let message = "added";
            if( formAction == "Add")
            {
              let message = '';
              if(invoiceList.length < 1) message = "Please add items"
              
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

              await api.post("invoice", {
                customer_name: values.customerName,
                discount_percent: discount,
                invoice_items: invoiceList
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
            getInvoice(page,rowsPerPage,searchValue,startDateValue,endDateValue)
            setInvoiceList([])
            setSubTotal(0)
            setTotal(0)
            setDiscount(0)

            toast.success(`Invoice ${message} successfully`, {
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="customerName">Customer Name</InputLabel>
                  <OutlinedInput
                    id="customerName"
                    type="text"
                    value={values.customerName}
                    name="customerName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter customer number"
                    fullWidth
                    error={Boolean(touched.customerName && errors.customerName)}
                    readOnly={formAction == "View" || formAction == "Edit"}
                  />
                  {touched.customerName && errors.customerName && (
                    <FormHelperText error id="standard-weight-helper-text-customerName-login">
                      {errors.customerName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1} textAlign="center">
                  <Typography variant="h5" component="h2">Product List</Typography>
                </Stack>
              </Grid>

              <Grid item xs={4}>
                <Stack spacing={1}>
                <InputLabel>Product</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Qty.</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Rate</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Total</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Action</InputLabel>
                </Stack>
              </Grid>
              
              {
                invoiceList.map((invoice) => {
                const { id, name , price, total, quantity} = invoice;
                return (
                  <>
                  <Grid item xs={4} >
                    <Stack spacing={1}>
                      <Typography key={id}>{name}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <OutlinedInput
                        id={id.toString()}
                        type="number"
                        value={quantity}
                        name="quantity"
                        onBlur={handleBlur}
                        onChange={(event) => updateQuantity(event,id)}
                        fullWidth
                        readOnly={formAction == "View"}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <Typography key={id}>Rs. {price}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <Typography key={id}>Rs. {total}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                    <Button variant="contained"
                      sx={{ backgroundColor:'red',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },}}
                      onClick={() => removeItemFromInvoice(id)}
                    ><DeleteIcon></DeleteIcon></Button>
                    </Stack>
                  </Grid>
              </>
                );
                })
              }


              <Grid item xs={4}>
                <Stack spacing={1}>
                   <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.branch}
                      onChange={(event) => {
                        handleChange(event);
                        addItemToInvoice(event.target.value)
                      }}
                      disabled={ formAction == "View"}
                    >
                      {
                        productList.map((product) => {
                        const invoiceIds = invoiceList.map(invoice => invoice.id);

                        const { id, name , is_enabled} = product;
                        return (
                          (formAction != "Add" && !invoiceIds.includes(id)) ? (
                            <MenuItem key={id} value={id} disabled={!is_enabled}>
                              {name}
                            </MenuItem>
                          ) : ( ( formAction == "Add" && is_enabled && !invoiceIds.includes(id)) ?
                            <MenuItem key={id} value={id} disabled={!is_enabled}>
                              {name}
                            </MenuItem> : null
                          )
                          );
                          })
                        }
                    </Select>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                {/* <Typography> 0 </Typography> */}
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  {/* <Typography>Rs. 0</Typography> */}
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  {/* <Typography>Rs. 0</Typography> */}
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  
                </Stack>
              </Grid>
              
              <Grid item xs={8}>
                <Stack spacing={1} sx={{float:'right'}}>
                <InputLabel>Sub. Total</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                <InputLabel>Rs. {subTotal}</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={8}>
                <Stack spacing={1} sx={{float:'right'}}>
                <InputLabel>Discount</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <OutlinedInput
                    id="discount"
                    type="number"
                    value={discount}
                    name="discount"
                    onBlur={handleBlur}
                    onChange={(event) => updateDiscount(event)}
                    fullWidth
                    readOnly={formAction == "View"}
                  />
                </Stack>
              </Grid>

              <Grid item xs={8}>
                <Stack spacing={1} sx={{float:'right'}}>
                <InputLabel>Total</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                <InputLabel>Rs. {total}</InputLabel>
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
                      {formAction == "Edit" ? "Update" : formAction} Invoice
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

export default InvoicePage;
