import * as React from 'react';

import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput, Autocomplete, Checkbox, FormControlLabel
      } from '@mui/material';

import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import {EyeOutlined,PlusOutlined} from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Divider from '@mui/material/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'branch', label: 'Branch', minWidth: 100 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'preparedBy', label: 'Prepared by', minWidth: 100 },
  { id: 'createdAt', label: 'Transaction Time', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 60},
];


const ExpenditurePage = () => {
  const userDetails = useSelector((state => state.userDetails));
  const navigate = useNavigate();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [startDateValue, setStartDateValue] = React.useState('');
  const [endDateValue, setEndDateValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);
  const [isProduct,setIsProduct] = React.useState(false)
  const [itemName,setItemName] = React.useState("")
  const [itemVariation,setItemVariation] = React.useState("")
  const [total,setTotal] = React.useState(0);
  const [formValue, setFormValue] = React.useState({"id":null,"customerName":"","invoiceNumber":""});
  const [expenditureList, setExpenditureList] = React.useState([]);

  const [formAction, setFormAction] = React.useState('Add');
  const [productList,setProductList] = React.useState([]);

  const [branchList, setBranchList] = React.useState([]);

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

  const getBranch = async(search) => {
     const response = await api.get('branch/get-list',{
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params:{
          filter: search
        }
      })

      setBranchList(response.data.data)
  }


  const getExpenditure = async (page,pageSize,search,starDate,endDate) => {
    try
    {
      const response = await api.get('expenditure', {
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
      getExpenditure(page,rowsPerPage,searchValue,startDateValue,endDateValue)
      getBranch()
  },[page,rowsPerPage,searchValue,startDateValue,endDateValue])

  useEffect( () => {
    if(!userDetails?.accessModuleData.includes("View-expenditure")){
      navigate('/dashboard')
    }
    getProductList()
  },[])
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const updateItemName = (e) => {
    setItemName(e.target.value)
  }

  const updateItemVariation = (e) => {
    setItemVariation(e.target.value)
  }

  const addProductToExpenditure = (productId) => {
    const selectedProduct = productList.find(product => product.model_id === productId);

    const updatedExpenditureList = [...expenditureList,{"id":selectedProduct['id'],"name":selectedProduct['name'],
              "quantity":1,"price": 0,"total":0,
              "isProduct":isProduct,"variation":null,"modelId":selectedProduct['model_id']}];

    setExpenditureList(updatedExpenditureList)
    updateTotalPrice(updatedExpenditureList)

    setIsProduct(false)

    console.log(updatedExpenditureList)
  } 

  const addItemToExpenditure = (itemName) => {
    const updatedExpenditureList = [...expenditureList,{"id":null,"name":itemName,
              "quantity":1,"price": 0,"total":0,
              "isProduct":isProduct,"variation":null,"modelId":null}];

    setExpenditureList(updatedExpenditureList)
    updateTotalPrice(updatedExpenditureList)
    
    setIsProduct(false)
  } 


  const removeItemFromExpenditure = (key) => {
    const updatedExpenditureList = [...expenditureList]
    updatedExpenditureList.splice(key,1)
    setExpenditureList(updatedExpenditureList)
    updateTotalPrice(updatedExpenditureList)
  }

  const updateQuantity = (event,key) => {
    
    const newQuantity = parseInt(event.target.value,10);

    if(isNaN(newQuantity) || newQuantity < 1) return false;

    const quantity = event.target.value;

    const updatedItems = expenditureList.map( (item,count) => {
      if (key === count) {
        return { ...item, quantity: quantity, total: quantity * item.price };
      }
      return item;
    });

    setExpenditureList(updatedItems)
    updateTotalPrice(updatedItems)
  } 

  const updatePrice = (event,key) => {
    const newPrice = parseInt(event.target.value,10);

    if(isNaN(newPrice) || newPrice < 1) return false;

    const price = event.target.value;

    const updatedItems = expenditureList.map( (item,count) => {
      if (key === count) {
        return { ...item, price: price, total: item.quantity * price };
      }
      return item;
    });

    setExpenditureList(updatedItems)
    updateTotalPrice(updatedItems)
  } 

  const updateItemVariationExpenditure = (event,key) => {
    const updatedItems = expenditureList.map( (item,count) => {
      if (key === count) {
        return { ...item, variation: event };
      }
      return item;
    });

    console.log(updatedItems)
    setExpenditureList(updatedItems)
    updateTotalPrice(updatedItems)
  } 

  const updateTotalPrice = (itemLists) => {
    const itemsTotal = itemLists.reduce((sum,item) => sum + parseFloat(item.total),0);
    setTotal(itemsTotal.toFixed(2))
  }
 

  const addExpenditure = () => {
    setFormAction("Add")
    setFormValue({
      "id":null,
      "branch_id":""
    })

    setTotal(0)
    setExpenditureList([])
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
    width: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY:'auto',
    maxHeight: '90vh'
  };


  const handleViewUpdate = (action,id) =>{
    setFormAction(action)
   
    rows.find(function(element){
      if(element['id'] == id)
      {
        setFormValue({
          "id":id,
          "branch":element['Branch']['name']
        })

        let expenditureProducts = []
        
        for(let i = element['ExpenditureHasProducts'].length - 1; i >= 0 ; i--)
        {
          let isProduct = element['ExpenditureHasProducts'][i]['is_product']
          let productId = null
          let productName = null
          let variation = null
          let modelId = null

          if(isProduct)
          { 
            productId = element['ExpenditureHasProducts'][i]['Product']['id'] ?? null
            productName = isProduct ? element['ExpenditureHasProducts'][i]['Product']['name'] : element['ExpenditureHasProducts'][i]['name']
            variation = element['ExpenditureHasProducts'][i]['ProductHasVariation']['colorCombination'],
            modelId = element['ExpenditureHasProducts'][i]['Product']['model_id']
          }
          else
          {
            productName = element['ExpenditureHasProducts'][i]['name']
            modelId = null
          }

          expenditureProducts[i] = {
            "id" : productId,
            "isProduct" : isProduct,
            "name" : productName,
            "quantity" : element['ExpenditureHasProducts'][i]['quantity'],
            "price" : element['ExpenditureHasProducts'][i]['cost'],
            "total" : parseFloat(element['ExpenditureHasProducts'][i]['quantity']) * parseFloat(element['ExpenditureHasProducts'][i]['cost']),
            "variation": variation,
            "modelId": modelId
          }
        }

        setExpenditureList(expenditureProducts.reverse())

        setTotal(element['total_cost'])

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
            options={branchList.map((value) => value.name)        
            } 
            onInputChange={(event, newInputValue) => {
              setSearchValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Branch"
                sx={{ my: 0.5, mx: 1, float: 'right', width: 200,paddingBottom:'10px'}}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        { userDetails?.accessModuleData.includes("Add-expenditure") &&
          <Button variant="contained"
            sx={{my:1,float:'right'}}
            onClick={addExpenditure}
          ><PlusOutlined /> <span style={{marginLeft:'5px'}}>Add</span></Button>
        }
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
            { rows && rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          { ( ["preparedBy"].includes(column.id)) ? (row.User.name) :( (column.id == "branch") ? row.Branch.name 
                            :
                            ((column.id == "total") ? "Rs. " + row.total_cost
                            : 
                            ( (column.id == "createdAt") ? formatDate(row.createdAt)
                            :
                            <span>
                                <Button onClick={() => handleViewUpdate("View",row.id)}>
                                    <EyeOutlined/></Button>  
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
        { (formAction !== "Print") &&
          <>
            <Typography id="modal-modal-title" variant="h2" component="h2" sx={{textAlign:'center'}}>
              {formAction} Expenditure
            </Typography>
            <Divider sx={{my:2}} />
          </>
        }
        <Formik

        id="formik-container"
        initialValues={{
          id: formAction.id,
          branch: formValue.branch,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          branch: Yup.string().max(255).required('Branch is required')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            let message = '';
            if(expenditureList.length < 1) message = "Please add items"
            
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

            if( formAction == "Add")
            {
              message = 'added'
              await api.post("expenditure", {
                branch:values.branch,
                expenditure_items: expenditureList,
                total_amount: total
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            }
            // else
            // {
            //   let formData = {
            //     customer_name: values.customerName,
            //     discount_percent:discount,
            //     invoice_items: expenditureList,
            //     status: invoiceStatus,
            //     payment_method_id:paymentMethod,
            //     received_amount: receivedAmount,
            //     changed_amount: changedAmount,
            //     offer_id: (offer != null) ? offer.id : '',
            //     offer_amount: (offer != null) ? offerAmount : ''
            //   };

            //   await api.put(`invoice/edit/${formValue.id}`, formData ,{
            //     headers: {
            //       'Authorization': `Bearer ${userToken}`
            //     }
            //   });
            //   message = "updated"
            // }

            setOpen(false)
            getExpenditure(page,rowsPerPage,searchValue,startDateValue,endDateValue)
            setExpenditureList([])
           
            setTotal(0)
            setDiscount(0)
            setInvoiceStatus('')
            setPaymentMethod('')

            toast.success(`Expenditure ${message} successfully`, {
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
           { (formAction != "Print") && <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="branch">Branch</InputLabel>

                  <Autocomplete
                    freeSolo
                    id="branchAuto"
                    disableClearable
                    options={branchList.map((value) => value.name)}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: '0 8px',
                        marginTop: '6px'
                      }
                    }}
                    value={values.branch}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: 'branch',
                          value: newValue
                        }
                      });
                    }}
                    disabled={formAction === 'View' || formAction === 'Edit'}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="branch"
                        name="branch"
                        type="text"
                        placeholder="Select branch"
                        onBlur={handleBlur}
                        error={Boolean(touched.branch && errors.branch)}
                        helperText={touched.branch && errors.branch}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          readOnly: formAction === 'View' || formAction === 'Edit'
                        }}
                      />
                    )}
                  />

        
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1} textAlign="center">
                  <Typography variant="h5" component="h2">Item List</Typography>
                </Stack>
              </Grid>
                  
              <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Is Product</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={1.5}>
                <Stack spacing={1}>
                <InputLabel>Item</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={1.5}>
                <Stack spacing={1}>
                <InputLabel>Variation</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={1.5}>
                <Stack spacing={1}>
                <InputLabel>Qty.</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={1.5}>
                <Stack spacing={1}>
                <InputLabel>Rate</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={1.5}>
                <Stack spacing={1}>
                <InputLabel>Total</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={1.5}>
                <Stack spacing={1}>
                <InputLabel>Action</InputLabel>
                </Stack>
              </Grid>
              
              {
                expenditureList.map((expenditure,key) => {
                const { id, name , price, total, quantity,isProduct,variation,modelId} = expenditure;
                return (
                  <>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                        <FormControlLabel
                          control={<Checkbox />}
                          disabled
                          checked={isProduct}
                        />
                    </Stack>
                  </Grid>
                  <Grid item xs={1.5} >
                    <Stack spacing={1}>
                      <Typography key={id}>{name} <br></br>{modelId ? `(${modelId})` : ""}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Stack spacing={1}>
                      <TextField
                        id="variation"
                        name="variation"
                        type="text"
                        placeholder="Enter variation"
                        value={variation ?? itemVariation}
                        onChange={event => updateItemVariation(event)}
                        onBlur={handleBlur}
                        disabled={id == null}
                        fullWidth
                        InputProps={{
                          readOnly: formAction === 'View' || formAction === 'Edit'
                        }}
                        onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          updateItemVariationExpenditure(event.target.value,key)
                          setItemVariation("")
                        }
                      }}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={1.5}>
                    <Stack spacing={1}>
                      <OutlinedInput
                        id={key}
                        type="number"
                        value={quantity}
                        name="quantity"
                        onBlur={handleBlur}
                        onChange={(event) => updateQuantity(event,key)}
                        fullWidth
                        readOnly={formAction == "View"}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Stack spacing={1}>
                      <OutlinedInput
                        id={key}
                        type="number"
                        value={price}
                        name="quantity"
                        onBlur={handleBlur}
                        onChange={(event) => updatePrice(event,key)}
                        fullWidth
                        readOnly={formAction == "View"}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={1.5}>
                    <Stack spacing={1}>
                      <Typography key={id}>Rs. {total}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Stack spacing={1}>
                    <Button variant="contained"
                      sx={{ backgroundColor:'red',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },}}
                      onClick={() => removeItemFromExpenditure(key)}
                      disabled = {formAction == "View"}
                    ><DeleteIcon></DeleteIcon></Button>
                    </Stack>
                  </Grid>
              </>
                );
                })
              }

              { (formAction != "View") &&
                <>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                        <FormControlLabel
                          control={<Checkbox />}
                          onChange={(event) => {
                            handleChange(event);
                            setIsProduct(!isProduct)
                          }}
                          checked = {isProduct}
                          disabled={ formAction == "View"}
                        />
                    </Stack>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Stack spacing={1}>
                      { isProduct ?
                      
                      <Autocomplete
                        freeSolo
                        id="productSelect"
                        disableClearable
                        options={productList.map((value) => value.model_id)}
                        sx={{
                          '& .MuiInputBase-root': {
                            padding: '0 8px',
                            marginTop: '6px'
                          }
                        }}
                        onChange={(event, newValue) => {
                          addProductToExpenditure(newValue)
                        }}
                      disabled={formAction === 'View' || formAction === 'Edit'}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="productSelect"
                          name="productSelect"
                          type="text"
                          placeholder="Select product"
                          onBlur={handleBlur}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            readOnly: formAction === 'View' || formAction === 'Edit'
                          }}
                        />
                      )}
                    />

                        :
                        <TextField
                          id="item"
                          name="item"
                          type="text"
                          placeholder="Enter item"
                          onBlur={handleBlur}
                          value={itemName}
                          onChange={event => updateItemName(event)}
                          fullWidth
                          InputProps={{
                            readOnly: formAction === 'View' || formAction === 'Edit'
                          }}
                          onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addItemToExpenditure(event.target.value)
                            setItemName("")
                          }
                        }}
                        />
                      }
                    </Stack>
                  </Grid>
                </>
              }
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
                      {formAction == "Edit" ? "Update" : formAction} Expenditure
                    </Button>
                  </AnimateButton>
                </Grid>
              }
            </Grid>
            }
            
           </form>
        )}
      </Formik>
      </Box>
    </Modal>

    </Paper>
  );
};

export default ExpenditurePage;
