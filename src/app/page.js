"use client"
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {IoSearch} from 'react-icons/io5';
import CityInfo from "./components/city-info";

export default function Home() {
  const key = "220bf77b081743862a50f764cf8773c8"
  const [text, setText] = useState('')
  const [city, setCity] = useState(null)
  const [notFound, setNotFound] = useState(false)

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
        <CityInfo city={city} />
      </form>
    </main>
  );
}
