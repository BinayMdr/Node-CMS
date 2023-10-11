import { configureStore } from '@reduxjs/toolkit'
import JwtRedux from './JwtRedux'

export default configureStore({
  reducer: {
    JwtRedux
  },
})