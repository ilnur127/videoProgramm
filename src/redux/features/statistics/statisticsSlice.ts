import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface statisticsState {
  activeTimeStamp: number
}

const initialState: statisticsState = {
  activeTimeStamp: 0
}

export const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setActiveTimeStamp: (state, action: PayloadAction<number>) => {
      state.activeTimeStamp = action.payload
    }
  }
})

export const { setActiveTimeStamp } = statisticsSlice.actions

export const selectActiveTimeStamp = (state: RootState): number =>
  state.statistics.activeTimeStamp

export default statisticsSlice.reducer
