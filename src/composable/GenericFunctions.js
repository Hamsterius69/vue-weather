export function genericFunctions () {
  function roundToTwo (num) {
    return (Math.round(num + 'e+2') + 'e-2')
  }

  function useKelvinAndCelsius (kelvin) {
    const celsius = kelvin - 273.15
    return `${kelvin}°K (${this.roundToTwo(celsius)}°C)`
  }

  return {
    roundToTwo,
    useKelvinAndCelsius
  }
}
