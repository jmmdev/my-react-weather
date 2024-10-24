import {IoSunny, IoCloudy, IoRainy, IoThunderstorm, IoSnow, IoReorderThree} from 'react-icons/io5';

export const GetTemp = ({period}) => {
    return <p className="">{Math.round(period.main.temp)}°</p>
}

export const GetHour = ({seconds}) => {
    const d = new Date(0)
    d.setUTCSeconds(seconds)
    const hours = d.getHours()
    
    return (hours > 9 ? '' : '0') + hours + ':00'
}

export const GetWeatherIcon = ({main}) => {
    switch(main) {
      case('Clear'):
        return <IoSunny style={{color: '#fc0'}}/>
      case('Clouds'):
        return <IoCloudy style={{color: '#bbb'}} />
      case('Drizzle'):
      case('Rain'):
        return <IoRainy style={{color: '#888'}}/>
      case('Thunderstorm'):
        return <IoThunderstorm style={{color: '#7ff'}}/>
      case('Snow'):
        return <IoSnow style={{color: '#fff'}} />
      default:
        return <IoReorderThree style={{color: '#fffa'}} />
    }
}