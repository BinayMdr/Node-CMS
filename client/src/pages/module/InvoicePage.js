import * as React from 'react';

import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,
        Typography,Button,Box,Modal, Grid,
        Stack, InputLabel,FormHelperText,
        OutlinedInput,Select, MenuItem, Autocomplete, Checkbox, FormControlLabel
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
import PrintIcon from '@mui/icons-material/Print';
import {useRef} from 'react';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from 'pages/invoice-pdf/ComponentToPrint';

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


  const componentRef = useRef();
 
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = React.useState('');
  const [startDateValue, setStartDateValue] = React.useState('');
  const [endDateValue, setEndDateValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalData,setTotalData] = React.useState(0);
  const [invoiceStatus, setInvoiceStatus] = React.useState('');
  const [invoiceData,setInvoiceData] = React.useState([]);
  const [offer,setOffer] = React.useState(null);
  const [offerAmount,setOfferAmount] = React.useState(0);

  const [subTotal,setSubTotal] = React.useState(0);
  const [total,setTotal] = React.useState(0);
  const [discount,setDiscount] = React.useState(0);
  const [formValue, setFormValue] = React.useState({"id":null,"customerName":"","invoiceNumber":""});
  const [invoiceList, setInvoiceList] = React.useState([]);

  const [formAction, setFormAction] = React.useState('Add');
  const [productList,setProductList] = React.useState([]);

  const [paymentMethodList, setPaymentMethodList] = React.useState([]);
  const [paymentMethod,setPaymentMethod] = React.useState("");
  const [receivedAmount,setReceivedAmount] = React.useState("");
  const [changedAmount,setChangedAmount] = React.useState("");

  const [branchList, setBranchList] = React.useState([]);
  const [tempBranch,setTempBranch] = React.useState(null)
  const [tempProduct,setTemProduct] = React.useState([])
  const [tempProductVariationList,setTemProductVariationList] = React.useState([])

  const [productVariationAutocomplete, setProductVariationAutcomplete] = React.useState('');
  const [productAutoComplete, setProductAutoComplete] = React.useState('');

  const [existingCustomer,setExistingCustomer] = React.useState(false)
  const [customerList,setCustomerList] = React.useState([])
  const [customerId,setCustomerId] = React.useState(null)
  const userToken = localStorage.getItem('token');


  const getProductList = async () => {
    try
    {
      const response = await api.get(`product/branch/${branchList.find(b => b.name === tempBranch)?.id}`, {
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

  const getPaymentMethodList = async () => {
    try
    {
      const response = await api.get('payment/get-list', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      setPaymentMethodList(response.data.data)
      
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

  const getProductVariation = async(productName) => {

    let productId = productList.find(p => p.name === productName)?.id
    setTemProduct(productId)

    let branchId = branchList.find(b => b.name === tempBranch)?.id
    const response = await api.get(`product/get-variation/${productId}/branch/${branchId}`,{
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
    
    const colorCombinationList = response.data.data.map(item => ({
      id: item.id,
      colorCombination: item.colorCombination,
      quantity: item.quantity
    }));
    setTemProductVariationList(colorCombinationList)
  }

  const getCustomer = async(search) => {
     const response = await api.get('customer/get-list',{
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params:{
          filter: search
        }
      })

      setCustomerList(response.data.data)
  }

  useEffect( () => {
      getInvoice(page,rowsPerPage,searchValue,startDateValue,endDateValue)
      getBranch()
  },[page,rowsPerPage,searchValue,startDateValue,endDateValue])

  useEffect( () => {
    getPaymentMethodList()
    getCustomer()
  },[])

  useEffect( () => {
    getProductList()
  },[tempBranch])

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

  const handleOffer = async (invoiceItems) => {

    try
    {
      const response = await api.get(`offer/check/${tempBranch}`,{
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          invoiceItems: invoiceItems
        }
      });

      if(response.data.data.length == 0) 
      { 
        setOffer(null)
        setOfferAmount(0)
        const itemsTotal = invoiceItems.reduce((sum,item) => sum + parseFloat(item.total),0);
        
        setSubTotal(itemsTotal.toFixed(2))

        let newTotal = 0;
        if(discount != 0)
        {
          newTotal = itemsTotal - (discount/100) * itemsTotal;          
          setTotal(newTotal)
          if(receivedAmount != 0) handleChangedAmount(newTotal,receivedAmount)
        }
        else
        { 
          setTotal(itemsTotal)

          if(receivedAmount != 0) handleChangedAmount(itemsTotal,receivedAmount)
        }
      }
      else 
      {
        setOffer(response.data.data)
        const itemsTotal = invoiceItems.reduce((sum,item) => sum + parseFloat(item.total),0);
        let newTotal
        if(response.data.data.offer_type == "Amount")
        {
          setSubTotal(itemsTotal.toFixed(2))
          newTotal = itemsTotal - response.data.data.amount_off
          setOfferAmount(response.data.data.amount_off)
          setTotal(newTotal)
        }
        else if(response.data.data.offer_type == "Discount")
        {
          if(response.data.data.offer_on == "Total Price")
          {
            setSubTotal(itemsTotal.toFixed(2))
            let offerDiscount = (response.data.data.discount_off/100) * itemsTotal
            setOfferAmount(offerDiscount.toFixed(2))
            newTotal = itemsTotal - offerDiscount
            setTotal(newTotal)
          }
          else(response.data.data.offer_on == "Product")
          {
            setSubTotal(itemsTotal.toFixed(2))

            const specificItemTotal = invoiceItems.reduce((sum, item) => {
                if (response.data.data.offer_on_product.includes(item.id)) {
                  return sum + parseFloat(item.total);
                }
                return sum;
              }, 0);

            let offerDiscount = (response.data.data.discount_off/100) * specificItemTotal
            setOfferAmount(offerDiscount.toFixed(2))
            newTotal = itemsTotal - offerDiscount
            setTotal(newTotal)
          }
        }

      }

    }
    catch(error)
    {
      console.log(error)
    }

  }

  const addItemToInvoice = (varitation) => {
    const selectedProduct = productList.find(product => product.id === tempProduct);
    
    const variationId = tempProductVariationList.find(c => c.colorCombination === varitation)

    const updatedInvoiceList = [...invoiceList,{"id":selectedProduct['id'],"name":selectedProduct['name'],
              "quantity":1,"price":selectedProduct['price'],"total":selectedProduct['price'],
              "variation":varitation, "variationId": variationId.id, "maxQuantity":variationId.quantity}];

    setInvoiceList(updatedInvoiceList)
    updateTotalPrice(updatedInvoiceList)

   
    handleOffer(updatedInvoiceList)
  } 

  const removeItemFromInvoice = (id) => {
    const updatedInvoiceList = invoiceList.filter(invoice => invoice.id !== id)
    setInvoiceList(updatedInvoiceList)
    updateTotalPrice(updatedInvoiceList)

    handleOffer(updatedInvoiceList)
  }

  const updateQuantity = (event,id,maxQuantity) => {
    const newQuantity = parseInt(event.target.value,10);

    if(isNaN(newQuantity) || newQuantity < 1) return false;

    const quantity = event.target.value;

    if(quantity > maxQuantity) return
    const updatedItems = invoiceList.map(item => {
      if (item.id === id) {
        return { ...item, quantity: quantity, total: quantity * item.price };
      }
      return item;
    });

    setInvoiceList(updatedItems)
    updateTotalPrice(updatedItems)

    handleOffer(updatedItems)
  } 

  const updateTotalPrice = (itemLists) => {
    const itemsTotal = itemLists.reduce((sum,item) => sum + parseFloat(item.total),0);
    setSubTotal(itemsTotal.toFixed(2))

    let newTotal = 0;
    if(discount != 0)
    {
      newTotal = itemsTotal - (discount/100) * itemsTotal;

      if(offer != null)
      {
         if(offer.offer_type == "Amount") newTotal = newTotal - offerAmount;
         else
         {
           let offerDiscount = (offer.discount_off/100) * newTotal;
           setOfferAmount(offerDiscount.toFixed(2));
           newTotal = newTotal - offerDiscount;
         }
      }

      setTotal(newTotal.toFixed(2))

      if(receivedAmount != 0) handleChangedAmount(newTotal,receivedAmount)
    }
    else
    {
      if(offer != null)
      {
        if(offer.offer_type == "Amount") newTotal = itemsTotal - offerAmount;
        else
        {
          let offerDiscount = (offer.discount_off/100) * itemsTotal;
          setOfferAmount(offerDiscount.toFixed(2));
          newTotal = itemsTotal - offerDiscount;
        }

        setTotal(newTotal.toFixed(2))

        if(receivedAmount != 0) handleChangedAmount(newTotal,receivedAmount)
      }
      else
      {
        setTotal(itemsTotal.toFixed(2))

        if(receivedAmount != 0) handleChangedAmount(itemsTotal,receivedAmount)
      }
    }
  }

  const updateDiscount = (event) => {
    const newDiscount = parseInt(event.target.value,10);

    if(isNaN(newDiscount) || newDiscount < 0) return false;

    setDiscount(event.target.value)

    const itemsTotal = subTotal

    let newTotal = 0;
    if(event.target.value != 0)
    {
      newTotal = itemsTotal - (newDiscount/100) * itemsTotal;

      if(offer != null)
      {
         if(offer.offer_type == "Amount") newTotal = newTotal - offerAmount;
         else
         {
           let offerDiscount = (offer.discount_off/100) * newTotal;
           setOfferAmount(offerDiscount.toFixed(2));
           newTotal = newTotal - offerDiscount;
         }
      }

      setTotal(newTotal.toFixed(2))

      if(receivedAmount != 0) handleChangedAmount(newTotal,receivedAmount)
    }
    else
    {
      if(offer != null)
      {
         if(offer.offer_type == "Amount") newTotal = itemsTotal - offerAmount;
         else
         {
           let offerDiscount = (offer.discount_off/100) * itemsTotal;
           setOfferAmount(offerDiscount.toFixed(2));
           newTotal = itemsTotal - offerDiscount;
         }
        
        setTotal(newTotal.toFixed(2))

        if(receivedAmount != 0) handleChangedAmount(newTotal,receivedAmount)
      }
      else
      {
        setTotal(itemsTotal.toFixed(2))

        if(receivedAmount != 0) handleChangedAmount(itemsTotal,receivedAmount)
      }
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
    setInvoiceStatus('')
    setInvoiceList([])
    setPaymentMethod('')
    setReceivedAmount(0)
    setChangedAmount(0)
    setOffer(null)
    setOfferAmount(0)
    setOpen(true)
    setTempBranch(null)
    setExistingCustomer(false)
    setCustomerId(null)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    p: '30px', 
    overflowY:'auto',maxHeight:'600px'
  };

  const handleViewUpdate = (action,id) =>{
    setFormAction(action)
    
    rows.find(function(element){
      if(element['id'] == id)
      {
        setFormValue({
          "id":id,
          "customerName":element['customer']['name'],
          "customerNumber":element['customer']['phone_number'],
          "invoiceNumber":element['invoice_number']
        })

        setSubTotal(element['sub_total'])
        setTotal(element['total'])
        setDiscount(element['discount_percent'])
        setInvoiceStatus(element['status'])
        setInvoiceList(element['products'])
        setPaymentMethod(element['payment_method_id'])
        setChangedAmount(element['changed_amount'])
        setReceivedAmount(element['received_amount'])

        setTempBranch(element['Branch']['name'])
        if(element['offer_id'] != null )
        {
          setOffer({
            'id': element['offer_id'],
            'name': element.Offer?.name,
            'offer_type': element.Offer?.discount_type,
            'discount_off': element.Offer?.discount_off,
            'amount_off': element.Offer?.amount_off
          })

          setOfferAmount(element['offer_amount'])
        }
        else
        {
          setOffer(null)
          setOfferAmount(0)
        }
        setInvoiceData(element);
      }
    });
    setOpen(true)
  } 

  const handleReceivedAmountChange = (event) => {
    const newReceivedAmount = parseInt(event.target.value,10);

    if(isNaN(newReceivedAmount) || newReceivedAmount < 0) return false;

    if(newReceivedAmount == 0)
    {
      setReceivedAmount(0)
      setChangedAmount(0)
      return false
    }
    setReceivedAmount(event.target.value)

    handleChangedAmount(total,event.target.value)
  }

  const handleChangedAmount = (newTotal,received_amount) => {
    const newChangedAmount = received_amount - newTotal;

    setChangedAmount(newChangedAmount)
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
                         {
                          ["invoice_number", "status", "preparedBy"].includes(column.id)
                            ? (column.format && typeof value === 'number' ? column.format(value) : value)
                            : column.id === "branch_id"
                              ? (row.Branch.is_enabled ? row.Branch.name : `${row.Branch.name} (Inactive)`)
                              : column.id === "total"
                                ? `Rs. ${row.total}`
                                : column.id === "createdAt"
                                  ? formatDate(row.createdAt)
                                  : column.id === "customer_name"
                                    ? row.customer.name
                                    : (
                                      <span>
                                        <Button onClick={() => handleViewUpdate("View", row.id)}>
                                          <EyeOutlined />
                                        </Button>
                                        <Button onClick={() => handleViewUpdate("Edit", row.id)}>
                                          <EditOutlined />
                                        </Button>
                                        <Button onClick={() => handleViewUpdate("Print", row.id)}>
                                          <PrintIcon />
                                        </Button>
                                      </span>
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
              {formAction} Invoice { (formValue.invoiceNumber != "") ? "("+(formValue.invoiceNumber)+")" : '' }
            </Typography>
            <Divider sx={{my:2}} />
          </>
        }
        <Formik

        id="formik-container"
        initialValues={{
          id: formAction.id,
          customerName: formValue.customerName,
          customerNumber: formValue.customerNumber,
          branch: tempBranch ?? null,
          submit: null
        }}
        validationSchema={Yup.object().shape({
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
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

            if( formAction == "Add")
            {
              message = 'added'
              
              console.log(existingCustomer)
              console.log(customerId)
              await api.post("invoice", {
                customer_name: !existingCustomer ? values.customerName : null,
                customer_number: !existingCustomer ? values.customerNumber : null,
                discount_percent: discount,
                invoice_items: invoiceList,
                offer_id: (offer != null) ? offer.id : '',
                offer_amount: (offer != null) ? offerAmount : '',
                status: invoiceStatus,
                payment_method_id:paymentMethod,
                received_amount: receivedAmount,
                changed_amount: changedAmount,
                branchName: values.branch,
                existingCustomer: existingCustomer,
                customer_id: existingCustomer ? customerId :null
              },{
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
            }
            else
            {
              let formData = {
                discount_percent:discount,
                invoice_items: invoiceList,
                status: invoiceStatus,
                payment_method_id:paymentMethod,
                received_amount: receivedAmount,
                changed_amount: changedAmount,
                offer_id: (offer != null) ? offer.id : '',
                offer_amount: (offer != null) ? offerAmount : '',
                branchName: values.branch
              };

              await api.put(`invoice/edit/${formValue.id}`, formData ,{
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
            setInvoiceStatus('')
            setPaymentMethod('')
            setTempBranch(null)
            
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
                      setTempBranch(newValue)
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
              
              { (formAction == "Add") &&
                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="existingCutomer"
                          name="existingCutomer"
                          checked={existingCustomer}
                          onChange={() => setExistingCustomer(!existingCustomer)}
                          onBlur={handleBlur}
                          disabled={formAction === "View" || formAction === "Edit"}
                        />
                      }
                      label="Existing Customer"
                    />
                  </Stack>
                </Grid>
              }


              {
                !existingCustomer ?
                <>
                  <Grid item xs={formAction == "Add" ? 4 : 6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="customerName">Customer Name</InputLabel>
                      <OutlinedInput
                        id="customerName"
                        type="text"
                        value={values.customerName}
                        name="customerName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter customer name"
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

                  <Grid item xs={formAction == "Add" ? 4 : 6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="customerNumber">Customer Number</InputLabel>
                      <OutlinedInput
                        id="customerNumber"
                        type="text"
                        value={values.customerNumber}
                        name="customerNumber"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter customer number"
                        fullWidth
                        error={Boolean(touched.customerNumber && errors.customerNumber)}
                        readOnly={formAction == "View" || formAction == "Edit"}
                      />
                      {touched.customerNumber && errors.customerNumber && (
                        <FormHelperText error id="standard-weight-helper-text-customerNumber-login">
                          {errors.customerNumber}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </>
                :
                <Grid item xs={8}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="customer">Customer</InputLabel>
                  <Autocomplete
                      freeSolo
                      id="customerAuto"
                      disableClearable
                      options={customerList.map((value) => ({
                      label: `${value.name} (${value.phone_number})`,
                      value: value.id 
                    }))}
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '0 8px',
                          marginTop: '6px'
                        }
                      }}
                      onChange={(event, newValue) => {
                          setCustomerId(newValue['value'])
                      }}
                      disabled={formAction === 'View' || formAction === 'Edit'}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="customer"
                          name="customer"
                          type="text"
                          placeholder="Select customer"
                          onBlur={handleBlur}
                          error={Boolean(touched.customer && errors.customer)}
                          helperText={touched.customer && errors.customer}
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
              }


              <Grid item xs={12}>
                <Stack spacing={1} textAlign="center">
                  <Typography variant="h5" component="h2">Product List</Typography>
                </Stack>
              </Grid>

              <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Product</InputLabel>
                </Stack>
              </Grid>
               <Grid item xs={2}>
                <Stack spacing={1}>
                <InputLabel>Variation</InputLabel>
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
                const { id, name , price, total, quantity,variation,maxQuantity} = invoice;
                return (
                  <>
                  <Grid item xs={2} >
                    <Stack spacing={1}>
                      <Typography key={id}>{name}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} >
                    <Stack spacing={1}>
                      <Typography key={id}>{variation} (Max: {maxQuantity})</Typography>
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
                        onChange={(event) => updateQuantity(event,id,maxQuantity)}
                        fullWidth
                        readOnly={formAction == "View"}
                        inputProps={{max: maxQuantity}}
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

              { (formAction != "View") &&
              <>
                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <Autocomplete
                      id="productAuto"
                      disableClearable
                      values={productAutoComplete}
                      options={
                        productList
                          .filter(product => {
                            const invoiceIds = invoiceList.map(invoice => invoice.id);
                            const { id, is_enabled } = product;
                            
                            if (formAction === "Add") {
                              return is_enabled && !invoiceIds.includes(id);
                            } else {
                              return !invoiceIds.includes(id);
                            }
                          })
                          .map(product => product.name)
                      }
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '0 8px',
                          marginTop: '6px'
                        }
                      }}
                      onChange={(event, newValue) => {
                        getProductVariation(newValue)
                        // addItemToInvoice(newValue);
                      }}
                      disabled={formAction === 'View'}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="product"
                          name="product"
                          type="text"
                          placeholder="Select product"
                          onBlur={handleBlur}
                          error={Boolean(touched.product && errors.product)}
                          helperText={touched.product && errors.product}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            readOnly: formAction === 'View'
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Grid>

                 <Grid item xs={2}>
                  <Stack spacing={1}>
                    <Autocomplete
                      id="productVariationAuto"
                      disableClearable
                      value={productVariationAutocomplete}
                      options={
                        tempProductVariationList.map(variation => variation.colorCombination)
                      }
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '0 8px',
                          marginTop: '6px'
                        }
                      }}
                      onChange={(event, newValue) => {
                        // getProductVariation(newValue)
                        addItemToInvoice(newValue);
                        setProductVariationAutcomplete('')
                        setProductAutoComplete('')
                      }}
                      disabled={formAction === 'View'}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="branchVariation"
                          name="branchVariation"
                          type="text"
                          placeholder="Select product variation"
                          onBlur={handleBlur}
                          error={Boolean(touched.branch && errors.branch)}
                          helperText={touched.branch && errors.branch}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            readOnly: formAction === 'View'
                          }}
                        />
                      )}
                    />
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
                    <InputLabel>Sub. Total</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                    <InputLabel>Rs. {subTotal}</InputLabel>
                    </Stack>
                  </Grid>
              { (offer == null) &&
                <>
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
                </>
              }

              {
                (offer != null) &&
                <>
                  <Grid item xs={8}>
                    <Stack spacing={1} sx={{float:'right'}}>
                    <InputLabel>Offer</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel style={{ whiteSpace: 'pre-line', overflowWrap: 'break-word', maxHeight: '100%' }}>
                        {offer.name} {offerAmount}
                      </InputLabel>
                    </Stack>
                  </Grid>
                </>
              }
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
              { 
                <> 
                     <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="received_amount">Received Amount</InputLabel>
                      <OutlinedInput
                        id="receivedAmount"
                        type="number"
                        value={receivedAmount}
                        name="receivedAmount"
                        onBlur={handleBlur}
                        onChange={handleReceivedAmountChange}
                        fullWidth
                        readOnly={formAction == "View"}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="changed_amount">Changed Amount</InputLabel>
                      <OutlinedInput
                        id="changedAmount"
                        type="number"
                        value={changedAmount}
                        name="changedAmount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        readOnly
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-status-select"
                        value={invoiceStatus}
                        onChange={(event) => {
                          setInvoiceStatus(event.target.value)
                        }}
                        disabled={ formAction == "View"}
                      >
                        <MenuItem key="Pending" value="Pending">Pending</MenuItem>
                        <MenuItem key="Completed" value="Completed">Completed</MenuItem>
                        <MenuItem key="Cancelled" value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Payment Method</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-status-select"
                          value={paymentMethod}
                          onChange={(event) => {
                            setPaymentMethod(event.target.value)
                          }}
                          disabled={ formAction == "View"}
                        >

                          {
                            paymentMethodList.map((paymentMethod) => {

                            return (
                                ( (paymentMethod.is_enabled) ? 
                                    <MenuItem key={paymentMethod.id} value={paymentMethod.id}>
                                      {paymentMethod.name}
                                    </MenuItem>
                                  :
                                  (
                                    (paymentMethod.id == paymentMethod) ?
                                    <MenuItem key={paymentMethod.id} value={paymentMethod.id}>
                                      {paymentMethod.name} (Inactive)
                                    </MenuItem>
                                    : null
                                  )
                                  
                                )
                              );
                              })
                          }

                        </Select>
                    </Stack>
                  </Grid> 
               
                </>
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
                      {formAction == "Edit" ? "Update" : formAction} Invoice
                    </Button>
                  </AnimateButton>
                </Grid>
              }
            </Grid>
            }
            
          { (formAction == "Print") &&
              <> 
                <ComponentToPrint ref={componentRef} invoiceData={invoiceData}/>
                <Grid item xs={12}>
                  <Button onClick={handlePrint} fullWidth size="large" type="button" variant="contained"
                    sx={{backgroundColor:'red',
                    '&:hover': {
                      backgroundColor: 'darkred',
                    }}}>Print this out!</Button>
                </Grid>
                </>
               }
           </form>
        )}
      </Formik>
      </Box>
    </Modal>

    </Paper>
  );
};

export default InvoicePage;
