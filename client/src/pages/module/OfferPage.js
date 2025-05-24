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
  { id: 'offer_type', label: 'Offer Type', minWidth: 100},
  { id: 'offer_on', label: 'Offer On', minWidth: 100},
  { id: 'is_enabled', label: 'Status', minWidth: 100},
  { id: 'action', label: 'Action', minWidth: 100},
];

const OfferPage = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);

  const [offerType,setOfferType] = React.useState("");
  const [offerOn,setOfferOn] = React.useState("");
  const [productList,setProductList] = React.useState([]);

  const [formValue, setFormValue] = React.useState({"id":null,"name":"",
              "offer_type":"","offer_on":"","offer_amount":"",
              "offer_on_product":"","offer_on_quantity":"","status":false})

  const [formAction, setFormAction] = React.useState('Add');

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

  const getOffer = async (page,pageSize,search) => {
    try
    {
      const response = await api.get('offer', {
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
      getOffer(page,rowsPerPage,searchValue)
      getProductList()
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

  const addOffer = () => {
    setFormAction("Add")
    setFormValue({
        "id":null,
        "name":"",
        "offer_on_amount":"",
        "offer_on_product":"",
        "offer_on_quantity":"",
        "discount_off":"",
        "amount_off":"",
        "status":false
    })
    setOfferOn("")
    setOfferType("")
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
            "offer_on_amount":element['offer_on_amount'],
            "offer_on_product":element['offer_on_product'],
            "offer_on_quantity":element['offer_on_quantity'],
            "discount_off":element['discount_off'],
            "amount_off":element['amount_off'],
            "status":element['is_enabled']
        })

        setOfferOn(element['offer_on'])
        setOfferType(element['offer_type'])
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
          onClick={addOffer}
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
                          { (column.id === "name" || column.id === "offer_on" || column.id === "offer_type")  ? (column.format && typeof value === 'number'
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
          {formAction} Offer
        </Typography>
        <Divider sx={{my:2}}/>
        <Formik
        initialValues={{
          name: formValue.name,
          offer_on_amount:formValue.offer_on_amount,
          offer_on_product:formValue.offer_on_product,
          offer_on_quantity:formValue.offer_on_quantity,
          discount_off:formValue.discount_off,
          amount_off:formValue.amount_off,
          status:formValue.status,
          submit: null

        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {

            let message = "";

            if(offerType == "") message = "Please select offer type";
            if(offerOn == "") message = "Please select offer on";

            if(offerType == "Amount" && values.amount_off == "") message = "Please enter the amount off";
            if(offerType == "Discount" && values.discount_off == "") message = "Please enter the discount off";

            if(offerOn == "Total Price" && values.offer_on_amount == "" ) message = "Please enter the offer on amount";
            if(offerOn == "Product" && values.offer_on_product == "" ) message = "Please select the product";
            if(offerOn == "Product" && values.offer_on_quantity == "" ) message = "Please enter the quantity";
            
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

            message = "added";


            if( formAction == "Add")
            {
              await api.post("offer", {
                name: values.name,
                offer_type: offerType,
                offer_on: offerOn,
                offer_on_amount: ( offerOn == "Total Price") ? values.offer_on_amount : '',
                offer_on_product: ( offerOn == "Product") ? values.offer_on_product : '',
                offer_on_quantity: ( offerOn == "Product") ? values.offer_on_quantity : '',
                discount_off: (offerType == "Discount") ? values.discount_off : '',
                amount_off : (offerType == "Amount") ? values.amount_off : '',
                is_enabled: values.status
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            }
            else
            {
              await api.put(`offer/edit/${formValue.id}`, {
                name: values.name,
                offer_type: offerType,
                offer_on: offerOn,
                offer_on_amount: ( offerOn == "Total Price") ? values.offer_on_amount : '',
                offer_on_product: ( offerOn == "Product") ? values.offer_on_product : '',
                offer_on_quantity: ( offerOn == "Product") ? values.offer_on_quantity : '',
                discount_off: (offerType == "Discount") ? values.discount_off : '',
                amount_off : (offerType == "Amount") ? values.amount_off : '',
                is_enabled: values.status
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              message = "updated"
            }

            setOpen(false)
            getOffer(page,rowsPerPage,searchValue)
            
            toast.success(`Offer ${message} successfully`, {
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
                  <InputLabel htmlFor="offerType">Offer Type</InputLabel>
                  <Select
                        labelId="Offer Type"
                        id="offer-type"
                        value={offerType}
                        onChange={(event) => {
                          handleChange(event);
                          setOfferType(event.target.value)
                        }}
                        disabled={ formAction == "View"}
                      >
                        
                        <MenuItem key="Discount" value="Discount" >
                            Discount
                        </MenuItem>
                        <MenuItem key="Amount" value="Amount" >
                            Amount
                        </MenuItem>
                      </Select>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="offerOn">Offer On</InputLabel>
                  <Select
                        labelId="Offer On"
                        id="offer-on"
                        value={offerOn}
                        onChange={(event) => {
                          handleChange(event);
                          setOfferOn(event.target.value)
                        }}
                        disabled={ formAction == "View"}
                      >
                        
                        <MenuItem key="Product" value="Product" >
                            Product
                        </MenuItem>
                        <MenuItem key="Total Price" value="Total Price" >
                            Total Price
                        </MenuItem>
                      </Select>
                </Stack>
              </Grid>
              {
                (offerOn == "Total Price") && 

                <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="offerOnAmount">Offer On Amount</InputLabel>
                  <OutlinedInput
                    id="offerAmount"
                    type="number"
                    value={values.offer_on_amount}
                    name="offer_on_amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter offer on amount"
                    fullWidth
                    error={Boolean(touched.offer_on_amount && errors.offer_on_amount)}
                    readOnly={formAction == "View"}
                  />
                </Stack>
                </Grid>
              }
                { (offerOn == "Product") && 
                <>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                  <InputLabel htmlFor="product">Product</InputLabel>
                    <Select
                        labelId="product-list"
                        id="product-list"
                        value={values.offer_on_product}
                        onChange={(event) => {
                          handleChange(event);
                          setFieldValue('offer_on_product', event.target.value);
                        }}
                        disabled={ formAction == "View"}
                      >
                        {
                          productList.map((product) => {

                          const { id, name } = product;
                          return (
                              <MenuItem key={id} value={id}>
                                {name}
                              </MenuItem>
                            );
                            })
                          }
                      </Select>
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="offerOnQuantity">Offer On Quantity</InputLabel>
                  <OutlinedInput
                    id="offerQuantity"
                    type="number"
                    value={values.offer_on_quantity}
                    name="offer_on_quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter offer on quantity"
                    fullWidth
                    error={Boolean(touched.offer_on_quantity && errors.offer_on_quantity)}
                    readOnly={formAction == "View"}
                  />
                </Stack>
                </Grid>
                </>
                }

                {
                  (offerType == "Discount") && 

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="discount_off">Discount Off</InputLabel>
                      <OutlinedInput
                        id="discount_offer"
                        type="number"
                        value={values.discount_off}
                        name="discount_off"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter discount off"
                        fullWidth
                        error={Boolean(touched.discount_off && errors.discount_off)}
                        readOnly={formAction == "View"}
                      />
                    </Stack>
                  </Grid>
                }

                {
                  (offerType == "Amount") && 

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="amount_off">Amount Off</InputLabel>
                      <OutlinedInput
                        id="amount_offer"
                        type="number"
                        value={values.amount_off}
                        name="amount_off"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter amount off"
                        fullWidth
                        error={Boolean(touched.amount_off && errors.amount_off)}
                        readOnly={formAction == "View"}
                      />
                    </Stack>
                  </Grid>
                }

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
                      {formAction == "Edit" ? "Update" : formAction} Offer
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

export default OfferPage;
