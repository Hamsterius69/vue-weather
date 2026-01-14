// Transform composable for weather data

export function useWeatherDataTransform () {
  /**
   * Transforma datos de weatherData para WeatherHero
   */
  const transformWeatherHero = (weatherData) => {
    if (!weatherData || !weatherData.name) return null

    return {
      cityName: `${weatherData.name}, ${weatherData.sys?.country || ''}`,
      temperature: Math.round(weatherData.main?.temp || 0),
      feelsLike: Math.round(weatherData.main?.feels_like || 0),
      condition: weatherData.weather?.[0]?.description || '',
      weatherMain: weatherData.weather?.[0]?.main || 'Clear',
      lastUpdated: 'Just now'
    }
  }

  /**
   * Transforma datos de weatherData para StatsGrid
   */
  const transformWeatherStats = (weatherData) => {
    if (!weatherData || !weatherData.main) return []

    return [
      {
        icon: 'las la-thermometer-half',
        label: 'Current',
        value: `${Math.round(weatherData.main.temp)}°`
      },
      {
        icon: 'las la-temperature-high',
        label: 'High',
        value: `${Math.round(weatherData.main.temp_max)}°`
      },
      {
        icon: 'las la-temperature-low',
        label: 'Low',
        value: `${Math.round(weatherData.main.temp_min)}°`
      },
      {
        icon: 'las la-tint',
        label: 'Humidity',
        value: `${weatherData.main.humidity}%`
      },
      {
        icon: 'las la-wind',
        label: 'Wind',
        value: `${weatherData.wind?.speed || 0} m/s`,
        sublabel: getWindDirection(weatherData.wind?.deg || 0)
      },
      {
        icon: 'las la-compress-arrows-alt',
        label: 'Pressure',
        value: `${weatherData.main.pressure} hPa`
      }
    ]
  }

  /**
   * Transforma rows de forecast para ForecastSection
   */
  const transformForecastData = (forecastRows) => {
    if (!forecastRows || forecastRows.length === 0) return []

    return forecastRows.map(row => ({
      date: row.date,
      maxTemp: Math.round(row.maxTemp),
      minTemp: Math.round(row.minTemp),
      description: row.description,
      weatherMain: row.weatherMain || 'Clear',
      windSpeed: Math.round(row.windSpeed),
      humidity: Math.round(row.humidity)
    }))
  }

  /**
   * Transforma rows de historical para HistoricalSection
   */
  const transformHistoricalData = (historicalRows) => {
    if (!historicalRows || historicalRows.length === 0) return []

    return historicalRows.map(row => ({
      date: row.date,
      maxTemp: Math.round(row.maxTemp),
      minTemp: Math.round(row.minTemp),
      avgTemp: Math.round(row.avgTemp),
      description: row.description,
      weatherMain: row.weatherMain || 'Clear',
      windSpeed: Math.round(row.windSpeed),
      humidity: Math.round(row.humidity),
      pressure: Math.round(row.pressure)
    }))
  }

  /**
   * Obtiene dirección del viento en grados
   */
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(deg / 45) % 8
    return directions[index]
  }

  return {
    transformWeatherHero,
    transformWeatherStats,
    transformForecastData,
    transformHistoricalData
  }
}
