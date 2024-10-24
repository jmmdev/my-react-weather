import {FiSunrise, FiSunset, FiMinimize2, FiWind, FiCloudRain, FiDroplet, FiThermometer, FiEye} from 'react-icons/fi';
import { GetHour } from '../../../public/functions';

export default function AdditionalData({data, forecast_today}) {

    const DataElement = ({title, value, icon}) => {
        return (
            <div key={title} className="bg-indigo-200 p-5 rounded-lg flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-indigo-800/75">{title}</p>
                    <p className="text-2xl font-medium">{value}</p>
                </div>
                <div className="text-3xl text-indigo-900/75">{icon}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 bg-indigo-100 p-4 overflow-x-auto rounded-lg">
            <h1 className="uppercase text-lg font-bold text-indigo-800/75">weather details</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <DataElement title={"Sunrise"} value={<GetHour seconds={data.sys.sunrise} />} icon={<FiSunrise />} />
                <DataElement title={"Sunset"} value={<GetHour seconds={data.sys.sunset} />} icon={<FiSunset />} />
                <DataElement title={"Pressure"} value={`${data.main.pressure} mb`} icon={<FiMinimize2 className="-rotate-45" />} />
                <DataElement title={"Wind"} value={`${data.wind.speed} km/h`} icon={<FiWind />} />
                <DataElement title={"Rain probability"} value={`${forecast_today.pop * 100}%`} icon={<FiCloudRain />} />
                <DataElement title={"Humidity"} value={`${data.main.humidity}%`} icon={<FiDroplet />} />
                <DataElement title={"Feels like"} value={`${Math.round(data.main.feels_like)}º`} icon={<FiThermometer />} />
                <DataElement title={"Visibility"} value={`${data.visibility / 1000} km`} icon={<FiEye />} />
            </div>
        </div>
    )
}