import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from '../features/api/apiSlice'
import statisticsReducer from '../features/statistics/statisticsSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    statistics: statisticsReducer
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
