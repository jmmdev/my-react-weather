import { useState } from "react";
import { GetTemp, GetHour, GetWeatherIcon } from "/public/functions";

export default function InfoForecast({days}) {

    const [activeDay, setActiveDay] = useState(0);
    
    const GetPeriodInfo = () => {
        const data = [];

        for (let period of days[activeDay]) {
            data.push(
                <div key={period.dt} className="bg-indigo-200 gap-2 px-5 py-2 rounded-lg flex flex-col items-center font-bold text-lg">
                    <div className="text-indigo-900/75"><GetHour seconds={period.dt} /></div>
                    <div className="text-3xl"><GetWeatherIcon main={period.weather[0].main} /></div>
                    <GetTemp period={period} />
                </div>
            )
        }
        return <div className="flex bg-indigo-100 gap-2 p-4 overflow-x-auto rounded-lg rounded-tl-none">{data}</div>;
    }

    const ForecastDaysTabs = () => {
        const resultInfo = []

        for (let [index, day] of days.entries()) {
            resultInfo.push(
                <div key={index}>
                    <button className={`${activeDay === index ? "bg-indigo-100 text-indigo-800/85" : "bg-indigo-200 text-indigo-900/85 hover:bg-indigo-300 active:bg-indigo-400"} uppercase sm:text-lg px-2 py-1 rounded-t-lg font-bold`}
                    onClick={() => setActiveDay(index)}>{getDate(day)}</button>
                </div>
            )
        }

        return (
            <div className="flex">
                {resultInfo}
            </div>
        );
    }

    const getDate = (day) => {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const date = new Date(0)
        date.setUTCSeconds(day[0].dt)

        return <p className="">{dayNames[date.getDay()].substring(0,3)} <span className="hidden sm:inline-block">{date.getDate()}</span></p> 
    }

        return (
            <div>
                {days &&
                <div>
                    <ForecastDaysTabs />
                    <GetPeriodInfo />
                </div>
                }
            </div>
        )
}