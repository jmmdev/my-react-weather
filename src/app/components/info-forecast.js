import styles from "../page.module.css"
import SingleForecastDayInfo from "./single-forecast-day-info";

export default function InfoForecast({data}) {

    const getForecastDays = () => {
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
        
        return days
    }

    const ForecastDaysInfo = () => {
        const resultInfo = []
        const days = getForecastDays()

        for (let day of days) {
            resultInfo.push(<SingleForecastDayInfo key={day[0].dt_txt} day={day} />)
        }

        return resultInfo
    }

    if (data)
        return (
            <>
                <p className={styles['forecast-header']}>Forecast for the next days</p>
                <div className={styles.forecast}>
                    <ForecastDaysInfo />
                </div>
            </>
        )
  return null 
}