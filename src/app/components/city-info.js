import { useState } from "react";
import styles from "../page.module.css"
import {IoSunny, IoCloudy, IoRainy, IoThunderstorm, IoSnow, IoReorderThree, IoWater, IoLocationSharp, IoSearch, IoHelpCircleOutline} from 'react-icons/io5';
import {FaWind} from 'react-icons/fa';

export default function CityInfo({city}) {
    const [showTooltip, setShowTooltip] = useState(false)

    const WeatherIcon = () => {
        switch(city.weather[0].main) {
          case('Clear'):
            return <IoSunny style={{color: '#fc0'}}/>
          case('Clouds'):
            return <IoCloudy style={{color: '#bbb'}} />
          case('Drizzle'):
          case('Rain'):
            return <IoRainy style={{color: '#ddd'}}/>
          case('Thunderstorm'):
            return <IoThunderstorm style={{color: '#7ff'}}/>
          case('Snow'):
            return <IoSnow style={{color: '#fff'}} />
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
        case('Clouds'):
          return '#888'
        case('Drizzle'):
          case('Rain'):
            return '#666'
        case('Thunderstorm'):
          return '#444'
        case('Snow'):
          return '#9ab'
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

      const msToDate = (ms, timezone) => {
        var d = new Date(0)
        d.setUTCSeconds(ms + timezone)
        return d
      }
    
      const formatDescription = text => {
        const firstChar = text.charAt(0).toUpperCase()
        return firstChar + text.slice(1)
      }

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
                <WeatherIcon />
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