"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {IoSunny, IoCloudy, IoRainy, IoThunderstorm, IoSnow, IoReorderThree, IoWater, IoLocationSharp, IoSearch, IoHelpCircleOutline} from 'react-icons/io5';
import {FaWind} from 'react-icons/fa';

export default function Home() {
  const key = "220bf77b081743862a50f764cf8773c8"
  const [text, setText] = useState('')
  const [city, setCity] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`).then(
            response => {
              if (response.status !== 200) {
                setNotFound(true)
                return
              }
              response.json().then(data => {
                setNotFound(false)
                setCity(data)
              })
            }
          ).catch (e => {
            console.log('error 1')
          })
        },
        e => {
          console.log('error 2')
        }
      )
    }
  }, [])

  const GetWeatherIcon = () => {
    switch(city.weather[0].main) {
      case('Clear'):
        return <IoSunny style={{color: '#fc0'}}/>
        break;
      case('Clouds'):
        return <IoCloudy style={{color: '#bbb'}} />
        break;
      case('Drizzle'):
      case('Rain'):
        return <IoRainy style={{color: '#ddd'}}/>
        break;
      case('Thunderstorm'):
        return <IoThunderstorm style={{color: '#7ff'}}/>
        break;
      case('Snow'):
        return <IoSnow style={{color: '#fff'}} />
        break;
      default:
        return <IoReorderThree style={{color: '#fffa'}} />
    }
  }

  const Tooltip = () => {
    if (showTooltip)
      return (
        <div className={styles.tooltip}>
          <p style={{whiteSpace: 'pre-line'}}>
            {
            `Some cities have the same name (i.e. Córdoba). To specify your desired country just type its identifier right after a comma as follows: xxxx, yy

            "cordoba, es / cordoba, ar"`
          }</p>
        </div>
        )
      return null
  }

  const getWeatherBg = () => {
    switch(city.weather[0].main) {
      case('Clear'):
      return '#08e'
      break;
    case('Clouds'):
      return '#888'
      break;
    case('Drizzle'):
    case('Rain'):
      return '#666'
      break;
    case('Thunderstorm'):
      return '#444'
      break;
    case('Snow'):
      return '#9ab'
      break;
    default:
      return '#aa9'
    }
  }

  const getWindDirection = () => {
    const deg = city.wind.deg

    if (deg >= 0 && deg <= 22.5 || deg > 337.5 && deg <= 360)
      return 'N'
    if (deg > 22.5 && deg <= 67.5)
      return 'NE'
    if (deg > 67.5 && deg <= 112.5)
      return 'E'
    if (deg > 112.5 && deg <= 157.5)
      return 'SE'
    if (deg > 157.5 && deg <= 202.5)
      return 'S'
    if (deg > 202.5 && deg <= 247.5)
      return 'SW'
    if (deg > 247.5 && deg <= 292.5)
      return 'W'
    return 'NW'
  }

  const getCityData = () => {
    const cleanText = text.trim()
    if (cleanText.length > 0){ 
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cleanText}&units=metric&appid=${key}`).then(
        response => {
          if (response.status !== 200) {
            setNotFound(true)
            return
          }
          response.json().then(data => {
            setNotFound(false)
            setCity(data)
          })
        }
      ).catch (e => {
        console.log('error')
      })
    }
  }

  const msToDate = (ms, timezone) => {
    var d = new Date(0)
    d.setUTCSeconds(ms + timezone)
    return d
  }

  const GetCityInfo = () => {
    if (city)
      return (
        <div className={styles['city-data']} style={{backgroundColor: getWeatherBg()}}>
          <div className={styles.head}>
            <div className={styles.location}>
              <IoLocationSharp />
              <p className={styles.name}>{city.name}, {city.sys.country}</p>
              <div className={styles.help} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <IoHelpCircleOutline />
              </div>
              <Tooltip />
            </div>
            <p className={styles.updated}>{msToDate(city.dt, city.timezone).toDateString()}</p>
          </div>
          <div className={styles.blocks}>
            <div className={styles['left-block']}>
              <div className={styles.temp}>
                <GetWeatherIcon />
                <p>{`${Math.round(city.main.temp)}°`}</p>
              </div>
              <p className={styles.description}>{formatDescription(city.weather[0].description)}</p>
            </div>
            <div className={styles['right-block']}>
              <div className={styles['extra-data']}>
                <div className={styles['extra-data-upper']}>
                  <IoWater />
                  <p>{`${Math.round(city.main.humidity)}%`}</p>
                </div>
                <p className={styles['extra-data-lower']}>Humidity</p>
              </div>
              <div className={styles['extra-data']}>
                <div className={styles['extra-data-upper']}>
                  <FaWind style={{transform: `rotate(${city.wind.deg+90}deg)`}} />
                  <p>{`${Math.round(city.wind.speed)} Km/h, ${getWindDirection()}`}</p>
                </div>
                <p className={styles['extra-data-lower']}>Wind speed</p>
              </div>
            </div>
          </div>
        </div>
        )
    return null 
  }

  const formatDescription = text => {
    const firstChar = text.charAt(0).toUpperCase()
    return firstChar + text.slice(1)
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>my-react-weather</h1>
      <form onSubmit={e => {
        e.preventDefault()
        getCityData()
        }}>
        <div className={styles.search}>
          <input className={styles['search__city']} placeholder="Search a city..."
          style={{fontStyle: text.length > 0 ? 'normal' : 'italic', color: notFound ? '#f00' : '#fff'}}
          value={text}
          onChange={e => {
            if (notFound)
              setNotFound(false)
            setText(e.target.value)
            }} type="text"/>
          <button className={styles['search__button']} onClick={() => getCityData()}>
            <IoSearch style={{fontSize: '24px'}} />
          </button>
          <input type="submit" hidden />
        </div>
        <GetCityInfo />
      </form>
    </main>
  );
}
