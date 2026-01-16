// actions

import weather from '../api/weather'

const actions = {
  callGetWeather (...args) {
    return weather.getWeather(args[1])
  },

  callGetForecastWeather (...args) {
    return weather.getForecastWeather(args[1])
  },

  callGetAirPollution (...args) {
    return weather.getAirPollution(args[1])
  },

  callGetAirPollutionForecast (...args) {
    return weather.getAirPollutionForecast(args[1])
  },

  callGetCity (...args) {
    return weather.getCity(args[1])
  },

  callGetAutocomplete (...args) {
    return weather.getAutocomplete(args[1])
  }
}

// mutations
const mutations = {

}

// initial state
const state = {
  xsBreakPoint: 880,
  smBreakPoint: 1000
}

export default {
  state,
  actions,
  mutations
}
