import styles from '../page.module.css'
import {IoSunny, IoCloudy, IoRainy, IoThunderstorm, IoSnow, IoReorderThree, IoWater} from 'react-icons/io5';
import {FaWind} from 'react-icons/fa';

export default function SingleForecastDayInfo({day}) {
    const getTemp = period => {
        return <p className={styles['period-temp']}>{Math.round(period.main.temp)}°</p>
    }

    const getHour = period => {
        const d = new Date(0)
        d.setUTCSeconds(period.dt)
        const hours = d.getHours()
        
        return <p className={styles['period-hour']}>{hours > 9 ? '' : '0'}{hours + ':00'}</p>
    }

    const getWeatherIcon = period => {
        switch(period.weather[0].main) {
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

    const getDate = () => {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const date = new Date(0)
        date.setUTCSeconds(day[0].dt)

        return <p className={styles.weekday}>{dayNames[date.getDay()]} {date.getDate()}</p> 
    }

    const GetPeriodInfo = () => {
        const data = []
        for (let period of day) {
            data.push(
                <div key={period.dt} className={styles['period-data']}>
                    <div className={styles['period-temp']}>
                        {getTemp(period)}
                        {getWeatherIcon(period)}
                    </div>
                    {getHour(period)}
                </div>
            )
        }
        return data
    }

    if (day) {
        return (
            <div>
                {getDate()}
                <div className={styles['period-data-container']}>
                    <GetPeriodInfo />
                </div>
            </div>
        )
    }
    return null
}