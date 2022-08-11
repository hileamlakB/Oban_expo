import { createSlice } from '@reduxjs/toolkit'

const initialUserData = {
  userAgreement: false,
  userInfo: {
    id: '',
    status: '',
    dob: '',
    firstName: '',
    lastName: '',
    middleName: '',
    address: { address: '', verfied: false },
    phone: {
      number: '',
      verfied: false,
    },
    bvn_data: {},
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserData,
  reducers: {},
})
