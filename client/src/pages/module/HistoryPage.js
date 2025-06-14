import * as React from 'react';
import {Paper,Table,TableBody,
        TableCell,TableContainer,TableHead,
        TablePagination,TableRow,TextField,Button, Autocomplete
      } from '@mui/material';
import { useEffect } from 'react';
import api from 'routes/Enpoint'
import {EditOutlined,EyeOutlined} from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';


const columns = [
  { id: 'branch', label: 'Branch Name', minWidth: 100 },
  { id: 'product', label: 'Product', minWidth: 100},
  { id: 'colorCombination', label: 'Variation', minWidth: 100},
  { id: 'previous_quantity', label: 'Previous Quantity', minWidth: 100},
  { id: 'new_quantity', label: 'New Quantity', minWidth: 100},
  { id: 'transaction_type', label: 'Transaction Type', minWidth: 100},

];

const BranchPage = () => {

  const { id } = useParams();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [branchValue, setBranchValue] = React.useState('');
  const [variationValue, setVariationValue] = React.useState('');
  const [rows,setRows] = React.useState([]);
  const [totalData,setTotalData] = React.useState(0);
  const [branchList, setBranchList] = React.useState([]);
  const [tempProductVariationList,setTemProductVariationList] = React.useState([])
  const userToken = localStorage.getItem('token');


  const getHistory = async (page,pageSize,branch,variation) => {
    try
    {
      const response = await api.get(`history/${id}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          branchId: branch,
          variationId: variation,
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

  const getProductVariation = async() => {

    let url = null
    if(branchValue !=  "")
    {
      let branchId = branchList.find(b => b.name === branchValue)?.id
      url = `product/get-variation/${id}/branch/${branchId}`
    }
    else
    {
      url = `product/get-variation/${id}`
    }

    const response = await api.get(url,{
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
    
   
    setTemProductVariationList(response.data.data)
  }

  useEffect( () => {
      getHistory(page,rowsPerPage,branchValue,variationValue)
      getBranch()
      getProductVariation()
  },[page,rowsPerPage,branchValue,variationValue])
  
  const handleChangePage = (event, newPage) => {
    setBranchValue(null)
    setVariationValue(null)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  

 
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ToastContainer></ToastContainer>

        <Autocomplete
          freeSolo
          id="branch-search"
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
            setBranchValue(newInputValue);
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

        <Autocomplete
          freeSolo
          id="variation-search"
          disableClearable
          sx={{
            '& .MuiInputBase-root': {
              padding: '0 8px',
              marginTop: '6px'
            }
          }}
          options={tempProductVariationList.map((value) => value.colorCombination)        
          } 
          onInputChange={(event, newInputValue) => {
            setVariationValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Variation"
              sx={{ my: 0.5, mx: 1, float: 'right', width: 200,paddingBottom:'10px'}}
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        />


      <TableContainer sx={{ maxHeight: 350 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
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
            {rows?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns?.map((column) => {
                      const value = row[column.id];
                      console.log(row)
                      return (
                        <TableCell key={column.id} align={column.align}>
                          { column.id === "branch" ? (column.format && typeof value === 'number'
                            ? value
                            : value?.name) : 
                            ((column.id == "product") ? value.name 
                            : 
                            (column.id == "previous_quantity" || column.id === "new_quantity" || column.id == "transaction_type") ? value 
                            : 
                            ( column.id == "colorCombination" ? row.variation.colorCombination : <span>
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
    </Paper>
  );
};

export default BranchPage;
