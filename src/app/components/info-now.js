import { GetWeatherIcon } from "../../../public/functions";

export default function InfoNow({data}) {
  return (
    <div>
    {data &&
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium">{data.name}, {data.sys.country}</h1>
        <div className="flex items-center gap-4 text-6xl">
          <p className="font-medium">{`${Math.round(data.main.temp)}°`}</p>
          <div className="text-7xl"><GetWeatherIcon main={data.weather[0].main}/></div>
        </div>
      </div>
    }
    </div>
  )
}