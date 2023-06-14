import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const tagTypes = ['statistics']

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://www.mocky.io/'
  }),
  tagTypes,
  endpoints: () => ({})
})
