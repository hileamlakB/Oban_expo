import { createSlice } from '@reduxjs/toolkit'

const initialBalance = {
  currentBalance: 0,
  borrowableAmount: 0,
  paymentDue: 0,
  dueDate: '',
  creditScore: 0,
  calandar: [],
}

export const balanceSlice = createSlice({
  name: 'balance',
  initialState: initialBalance,
  reducers: {},
})
