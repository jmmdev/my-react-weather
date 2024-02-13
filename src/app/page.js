"use client"
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {IoSearch} from 'react-icons/io5';
import InfoNow from "./components/info-now";
import InfoForecast from "./components/info-forecast";

export default function Home() {
  const key = "220bf77b081743862a50f764cf8773c8"
  const [text, setText] = useState('')
  const [city, setCity] = useState({now: null, forecast: null})
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {

    const getLocationWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            try {
              const responseNow = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`)
              
              if (responseNow.status !== 200) {
                setNotFound(true)
                return
              }
              
              const nowData = await responseNow.json()
              setNotFound(false)
              
              const responseForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`)
              const forecastData = await responseForecast.json()
      
              setCity({now: nowData, forecast: forecastData})
            } catch (e) {
              console.log(e)
            }
          }
        )
      }
    }
    getLocationWeather()
  }, [])
  
  const getWeatherData = async () => {
    const cleanText = text.trim()
      if (cleanText.length > 0){
        try {
          const responseNow = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cleanText}&units=metric&appid=${key}`)
          
          if (responseNow.status !== 200) {
            setNotFound(true)
            return
          }
          
          const nowData = await responseNow.json()
          setNotFound(false)
          
          const responseForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cleanText}&units=metric&appid=${key}`)
          const forecastData = await responseForecast.json()

          setCity({now: nowData, forecast: forecastData})
      } catch (e) {
        console.log(e)
      }
    }
  }

  const Placeholder = () => {
    if (city.now)
      return null
    return <p className={styles.placeholder}>Retrieving weather information...</p>
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>my-react-weather</h1>
      <form onSubmit={e => {
        e.preventDefault()
        getWeatherData()
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
          <button className={styles['search__button']} onClick={() => getWeatherData()}>
            <IoSearch style={{fontSize: '24px'}} />
          </button>
          <input type="submit" hidden />
        </div>
        <InfoNow data={city.now} />
        <InfoForecast data={city.forecast} />
      </form>
      <Placeholder />
    </main>
  );
}
