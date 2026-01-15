export function genericFunctions () {
  function roundToTwo (num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  function useKelvinAndCelsius (kelvin) {
    const celsius = kelvin - 273.15
    return `${kelvin}°K (${roundToTwo(celsius)}°C)`
  }

  function kelvinToCelsius (kelvin) {
    return Math.round(kelvin - 273.15)
  }

  const getEpochNumber = (addNumberOfDays) => {
    const currentDate = new Date()
    const fiveDaysBefore = new Date(currentDate.setDate(currentDate.getDate() + addNumberOfDays))
    const utcDate = fiveDaysBefore.toUTCString()
    const epoch = Math.round(Date.parse(utcDate) / 1000)
    return epoch
  }

  const numberToHour = (num) => {
    const date = new Date(0)
    date.setSeconds(num)
    return `${setFormatTwoDigits(date.getHours())}:${setFormatTwoDigits(date.getMinutes())}`
  }

  const setFormatTwoDigits = (num) => {
    let result = num
    if (num / 10 < 1) {
      result = `0${num}`
    }
    return result
  }

  const epochToDateString = (epoch) => {
    const dt = new Date(epoch * 1000)
    return `${dt.getFullYear()}/${setFormatTwoDigits(dt.getMonth() + 1)}/${setFormatTwoDigits(dt.getDate())}`
  }

  return {
    roundToTwo,
    useKelvinAndCelsius,
    kelvinToCelsius,
    getEpochNumber,
    epochToDateString,
    numberToHour
  }
}
