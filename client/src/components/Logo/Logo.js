import { useEffect,useState } from "react";
import api from 'routes/Enpoint';
import { useDispatch, useSelector } from 'react-redux';
import { updateGlobalName } from "store/reducers/globalSetting";
import { Typography } from "../../../node_modules/@mui/material/index";
// material-ui

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {

  const dispatch = useDispatch();

  const {globalName} = useSelector((state => state.globalSetting));
  const [globalSettingName,setGlobalSettingName] = useState('');

  const getGlobalSetting = async () => {
    try
    {
      const response = await api.get('global-setting');

      const pluckedData = response.data.data.map(({name,value}) => ({
        name,value
      }));
      
      const convertedObject = pluckedData.reduce((result, { name, value }) => {
        result[name] = value;
        return result;
      }, {});

      dispatch(updateGlobalName({ globalName: convertedObject['name'] }))
      setGlobalSettingName(convertedObject['name'])
    }
    catch(error)
    {
      console.log(error)
    }
  } 

  useEffect( () => {
    getGlobalSetting()
  },[])

  useEffect( () => {
    setGlobalSettingName(globalName)
  });
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
     {
      (window.location.href !== `${process.env.REACT_APP_URL}login`) ? <Typography variant="h3" component="h3" fontWeight="800">{globalSettingName ?? ""}</Typography> : null
      }
    </>
  );
};

export default Logo;
