import { apiSlice } from '../api/apiSlice'

interface IStatistic {
  id: number
  timestamp: number
  duration: number
  zone: { left: number, top: number, width: number, height: number }
}

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStatistics: build.query<
    IStatistic[],
    undefined
    >({
      query: () => '/v2/5e60c5f53300005fcc97bbdd',
      providesTags: [{ type: 'statistics', id: 'LIST' }]
    })
  })
})
export const { useGetStatisticsQuery } = messagesApiSlice
