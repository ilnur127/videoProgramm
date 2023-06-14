import React, { useRef, useMemo, useCallback, useState } from 'react'
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

  const [activeIndex, setActiveIndex] = useState(0)
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

  const changeVideoTime = useCallback((timestamp: number, index: number) => {
    dispatch(setActiveTimeStamp(timestamp))
    if (videoRef.current !== null) {
      videoRef.current.currentTime = timestamp / 1000
    }
    setActiveIndex(index)
  }, [dispatch])
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
            <div>
              {statistics.length > 0
                ? (
                  <>
                    <div className={classes.eventsList}>
                      {statistics.map((stat, i) => (
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
                            changeVideoTime(stat.timestamp, i)
                          }}
                        >
                          {timestampDecode(stat.timestamp)} -{' '}
                          {timestampDecode(stat.timestamp + stat.duration)}
                        </div>
                      ))}
                    </div>
                    <div className={classes.eventsList__actions}>
                      <button title='Первое событие' onClick={() => {
                        changeVideoTime(statistics[0].timestamp, 0)
                      }}>&lt;&lt;</button>
                      <button title='Предыдущее событие' onClick={() => {
                        changeVideoTime(statistics[activeIndex - 1].timestamp, activeIndex - 1)
                      }}>&lt;</button>
                      <button title='Следующее событие' onClick={() => {
                        changeVideoTime(statistics[activeIndex + 1].timestamp, activeIndex + 1)
                      }}>&gt;</button>
                      <button title='Последнее событие'onClick={() => {
                        changeVideoTime(statistics[statistics.length - 1].timestamp, statistics.length - 1)
                      }}>&gt;&gt;</button>
                    </div>
                  </>
                  )
                : (<div>Статистики нет</div>)}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default App
