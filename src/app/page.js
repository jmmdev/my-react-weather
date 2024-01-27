"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import {IoSunnyOutline, IoCloudyOutline, IoRainyOutline, IoThunderstormOutline, IoSnowOutline, IoReorderThreeOutline, IoWaterOutline, IoArrowForwardOutline, } from 'react-icons/io5';

export default function Home() {
  const key = "220bf77b081743862a50f764cf8773c8"
  const [text, setText] = useState('')
  const [city, setCity] = useState(null)

  const GetWeatherIcon = () => {
    switch(city.weather[0].main) {
      case('Clear'):
        return <IoSunnyOutline />
        break;
      case('Clouds'):
        return <IoCloudyOutline />
        break;
      case('Drizzle'):
      case('Rain'):
        return <IoRainyOutline />
        break;
      case('Thunderstorm'):
        return <IoThunderstormOutline />
        break;
      case('Snow'):
        return <IoSnowOutline />
        break;
      default:
        return <IoReorderThreeOutline />
    }
  }

  const getCityData = () => {
    if (text.length > 0){  
      fetch("https://api.openweathermap.org/data/2.5/weather?q="+ text + "&units=metric&appid=" + key).then(
        response => {
          response.json().then(data => {
            setCity(data)
          })
        }
      )
    }
  }

  const GetCityInfo = () => {
    if (city)
      return (
        <div className={styles['city-data']}>
          <div className={styles['left-block']}>
            <div className={styles.temp}>
              <GetWeatherIcon />
              <p>{`${Math.round(city.main.temp)}°`}</p>
            </div>
            <p className={styles.description}>{formatDescription(city.weather[0].description)}</p>
          </div>
          <div className={styles['right-block']}>
            <p>{`Min/Max: ${Math.round(city.main.temp_min)}°/${Math.round(city.main.temp_max)}°`}</p>
            <div>
              <IoWaterOutline />
              <p>{`Humidity: ${Math.round(city.main.humidity)}%`}</p>
            </div>
            <div>
              <p>{`Wind: ${Math.round(city.wind.speed)} Km/h`}</p>
              <div style={{transform: `rotate(${city.wind.deg}deg)`}}>
                <IoArrowForwardOutline />
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
      <input value={text} onChange={e => setText(e.target.value)} type="text"/>
      <GetCityInfo />
      <button onClick={() => getCityData(text)}>DALE</button>
    </main>
  );
}
