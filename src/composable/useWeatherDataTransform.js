// Transform composable for weather data
import { inject } from 'vue'
import { useWeatherData } from './useWeatherData'

export function useWeatherDataTransform () {
  // Try to inject conversion functions, fall back to useWeatherData
  let convertTemperature = inject('convertTemperature', null)
  let convertFromKelvin = inject('convertFromKelvin', null)

  if (!convertTemperature || !convertFromKelvin) {
    const weatherData = useWeatherData()
    convertTemperature = weatherData.convertTemperature
    convertFromKelvin = weatherData.convertFromKelvin
  }

  /**
   * Transforma datos de weatherData para WeatherHero
   * Los datos de la API vienen en Kelvin
   */
  const transformWeatherHero = (weatherData) => {
    if (!weatherData || !weatherData.name) return null

    return {
      cityName: `${weatherData.name}, ${weatherData.sys?.country || ''}`,
      temperature: convertFromKelvin(weatherData.main?.temp || 273.15),
      feelsLike: convertFromKelvin(weatherData.main?.feels_like || 273.15),
      condition: weatherData.weather?.[0]?.description || '',
      weatherMain: weatherData.weather?.[0]?.main || 'Clear',
      lastUpdated: 'Just now'
    }
  }

  /**
   * Transforma datos de weatherData para StatsGrid
   * Los datos de la API vienen en Kelvin
   */
  const transformWeatherStats = (weatherData) => {
    if (!weatherData || !weatherData.main) return []

    return [
      {
        icon: 'las la-thermometer-half',
        label: 'Current',
        value: `${convertFromKelvin(weatherData.main.temp)}°`
      },
      {
        icon: 'las la-temperature-high',
        label: 'High',
        value: `${convertFromKelvin(weatherData.main.temp_max)}°`
      },
      {
        icon: 'las la-temperature-low',
        label: 'Low',
        value: `${convertFromKelvin(weatherData.main.temp_min)}°`
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
   * Los datos ya están convertidos a Celsius en useWeatherData
   */
  const transformForecastData = (forecastRows) => {
    if (!forecastRows || forecastRows.length === 0) return []

    return forecastRows.map(row => ({
      date: row.date,
      maxTemp: convertTemperature(row.maxTemp),
      minTemp: convertTemperature(row.minTemp),
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
