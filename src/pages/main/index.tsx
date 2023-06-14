import React, { useRef, useMemo } from 'react'
import clsx from 'clsx'

import { useAppDispatch, useAppSelector } from '../../redux/app/hooks'
import { selectActiveTimeStamp, setActiveTimeStamp } from '../../redux/features/statistics/statisticsSlice'
import { useGetStatisticsQuery } from '../../redux/features/statistics/statisticsApiSlice'

import Loader from '../../components/UI/Loader'

import type { ChangeEvent } from 'react'

import classes from './mainPage.module.css'

const timestampDecode = (timestamp: number): string => {
  const secunds = Math.floor(timestamp / 1000)
  const millisec = timestamp % 1000
  const minutes = Math.floor(secunds / 60)
  const sec = secunds % 60

  return `${minutes > 10 ? minutes : `0${minutes}`}:${
    sec > 10 ? sec : `0${sec}`
  }:${
    millisec > 100 ? millisec : millisec > 10 ? `0${millisec}` : `00${millisec}`
  }`
}

function App (): JSX.Element {
  const dispatch = useAppDispatch()

  const activeTimeStamp = useAppSelector(selectActiveTimeStamp)

  const videoRef = useRef<HTMLVideoElement>(null)

  const { data, isLoading, isSuccess, isError, error } =
    useGetStatisticsQuery(undefined)

  const statistics = useMemo(() =>
    data !== null && data !== undefined && data.length > 0
      ? data.slice().sort((a, b) => {
        return a.timestamp - b.timestamp
      })
      : []
  , [data])

  if (isError) {
    console.error(error)
  }

  return (
    <>
      {isLoading && <Loader />}
      {isSuccess && (
        <div className={classes.mainBlock}>
          <div className={classes.videoBlock}>
            <video
              ref={videoRef}
              preload="metadata"
              controls
              muted
              loop
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              onTimeUpdate={(e: ChangeEvent<HTMLVideoElement>) => {
                dispatch(setActiveTimeStamp(e.target.currentTime * 1000))
              }}
            ></video>
            {statistics.length > 0
              ? (
                  statistics
                    .filter(
                      (stat) =>
                        activeTimeStamp >= stat.timestamp &&
                        activeTimeStamp <= stat.timestamp + stat.duration
                    )
                    .map((stat) => <div key={stat.id} style={{ ...stat.zone }} className={classes.eventBlock}/>))
              : (<></>)
            }
          </div>
          <aside>
            <h3 className={classes.eventsList__header}>Список событий</h3>
            <div className={classes.eventsList}>
              {statistics.length > 0
                ? (
                    statistics.map((stat) => (
                      <div
                        key={stat.id}
                        className={clsx(
                          classes.eventsList__item,
                          activeTimeStamp >= stat.timestamp &&
                          activeTimeStamp <= stat.timestamp + stat.duration
                            ? classes.eventsList__item_active
                            : ''
                        )}
                        onClick={() => {
                          dispatch(setActiveTimeStamp(stat.timestamp))
                          if (videoRef.current !== null) {
                            videoRef.current.currentTime = stat.timestamp / 1000
                          }
                        }}
                      >
                        {timestampDecode(stat.timestamp)} -{' '}
                        {timestampDecode(stat.timestamp + stat.duration)}
                      </div>
                    )))
                : (<div>Статистики нет</div>)}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default App
