"use client"
import { useEffect, useState } from "react";
import {FiSearch, FiHelpCircle} from 'react-icons/fi';
import InfoNow from "./components/info-now";
import InfoForecast from "./components/info-forecast";
import { GetTemp, GetHour, GetWeatherIcon } from "/public/functions";
import AdditionalData from "./components/additional-data";

export default function Home() {
  const key = "220bf77b081743862a50f764cf8773c8"
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [city, setCity] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const getLocationWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            fetchLocalData(true, position);
          },
          (err) => {
            setTimeout(() => {
              setIsLoading(false);
            }, 5000);
          },
          (options) => {

          }
        );
      } else {
        setIsLoading(false);
      }
    }
    getLocationWeather();
  }, [])

  async function fetchLocalData(local, position) {
    let url_now = "";
    let url_forecast=""; 
    
    if (local) {
      url_now = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`;
      url_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`;
    }
    else {
      const cleanText = text.trim();

      if (cleanText.length > 0) {
        url_now = `https://api.openweathermap.org/data/2.5/weather?q=${cleanText}&units=metric&appid=${key}`;
        url_forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cleanText}&units=metric&appid=${key}`;
      }
    }
  
    if (url_now.length <= 0 || url_forecast.length <= 0) {
      return;
    }

    try {
      const responseNow = await fetch(url_now)
      
      if (responseNow.status !== 200) {
        setNotFound(true);
        return;
      }
      
      const nowData = await responseNow.json();
      setNotFound(false);
      
      const responseForecast = await fetch(url_forecast);
      const forecastData = await responseForecast.json()

      const forecast_week = getForecastDays(forecastData);
      const forecast_today = forecast_week.shift();

      setCity({now: nowData, forecast_today: forecast_today, forecast_week: forecast_week})
      setIsLoading(false);
    } catch (e) {
      console.log(e)
    }
  }

  function getForecastDays(data) {
    const days = []
    let chunk = []
    let ref_date = null

    for (const entry of data.list) {
        if (ref_date === null) {
            ref_date = new Date(0)
            ref_date.setUTCSeconds(entry.dt)
        }

        if (!chunk.length > 0) {
            chunk.push(entry)
        } 
        else {
            const compare_date = new Date(0)
            compare_date.setUTCSeconds(entry.dt)

            if (ref_date.getDate() !== compare_date.getDate()) {
                days.push(chunk)
                chunk = []
            }
            
            chunk.push(entry)
        }

        ref_date = new Date(0)
            ref_date.setUTCSeconds(entry.dt)
    }
    return days;
}

  const ErrorPlaceholder = () => {
    return (
      <div className="h-full flex-auto flex flex-col justify-center items-center gap-4 p-16 text-center">
        <p className="text-xl">Your weather information could not be retrieved. Please, make sure geolocation access is allowed in your device and refresh this page.</p>
        <p>You still may use the search bar above to find yours or any other city information.</p>
      </div>
    );
  }

  const LoadingPlaceholder = () => {
    return (
      <div className="h-full flex-auto flex flex-col justify-center items-center gap-4 text-center">
        <div role="status">
        <svg aria-hidden="true" className="w-8 h-8 text-indigo-200 animate-spin fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
        <p className="text-xl">Retrieving your weather information, please wait...</p>
      </div>
    );
  }

  const InfoToday = () => {
    const data = [];

    for (let period of city.forecast_today) {
      data.push(
          <div key={period.dt} className="bg-indigo-200 gap-2 px-5 py-2 rounded-lg flex flex-col items-center font-bold text-lg">
            <div className="text-indigo-900/75"><GetHour seconds={period.dt} /></div>
            <div className="text-3xl"><GetWeatherIcon main={period.weather[0].main} /></div>
            <GetTemp period={period} />
          </div>
      )
    }
    return (
      <div className="flex flex-col gap-2 bg-indigo-100 py-4 rounded-lg">
        <h1 className="sticky left-0 uppercase text-lg font-bold text-indigo-800/75 pl-4">today&apos;s forecast</h1>
        <div className="flex gap-2 px-4 overflow-x-auto">{data}</div>
      </div>
    )
  }

  const Tooltip = () => {
    return (
      <div className="absolute top-full right-0 max-w-xl mt-4 bg-indigo-50 p-4 rounded-md text-sm text-indigo-900/85">
        <p>
          Some cities from different countries have the same name (i.e. Córdoba). Use a country identifier to specify yours: &quot;cordoba, es / cordoba, ar&quot;
        </p>
      </div>
      )
  }

  return (
    <div className="mx-auto max-w-5xl min-h-screen flex flex-col md:py-24">
      <main className="w-full min-h-full py-16 flex flex-col flex-auto px-4 sm:px-8 lg:rounded-3xl bg-white">
        {!isLoading &&
        <form className="flex flex-col gap-8" onSubmit={e => {
          e.preventDefault();
          
          const cleanText = text.trim();
          fetchLocalData(cleanText.length > 0 ? false : true);
          }}>
          <div className="relative flex items-center">
            <button className="text-2xl text-white bg-indigo-400 rounded-l-md p-1 hover:bg-indigo-300 active:bg-indigo-500" onClick={() => fetchLocalData(false)}>
              <FiSearch />
            </button>
            <input className={`w-full bg-indigo-100 rounded-r-md px-2 py-1 focus-visible:outline-none ${notFound ? "text-red-500" : "text-black"}`} placeholder="Search for cities"
            value={text}
            onChange={e => {
              if (notFound)
                setNotFound(false)
              setText(e.target.value)
              }} type="text"/>
              <button className="cursor-help" onMouseEnter={() => setShowTooltip(true)} onFocus={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onBlur={() => setShowTooltip(false)} onClick={e => e.preventDefault()}>
                <FiHelpCircle className="text-3xl text-indigo-400 ml-2"/>
              </button>
              {showTooltip && <Tooltip />}
            <input type="submit" hidden />
          </div>
          {city &&
          <div className="w-full flex flex-col bg-white rounded-lg gap-8">
            {city.now && <InfoNow data={city.now} />}
            {city.forecast_today && <InfoToday />}
            {city.now && city.forecast_today && <AdditionalData data={city.now} forecast_today={city.forecast_today[0]}/>}
            {city.forecast_week && <InfoForecast days={city.forecast_week} />}
          </div>
          }
        </form>
        }
        {isLoading && <LoadingPlaceholder />}
        {!isLoading && !city && <ErrorPlaceholder />}
      </main>
    </div>
  );
}
