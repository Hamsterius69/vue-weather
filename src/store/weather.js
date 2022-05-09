// actions

import weather from '../api/weather'

const actions = {
  callGetWeather (...args) {
    return weather.getWeather(args[1])
  },

  callGetHistoricalWeather (...args) {
    return weather.getHistoricalWeather(args[1])
  },

  callGetForecastWeather (...args) {
    return weather.getForecastWeather(args[1])
  },

  callGetCity (...args) {
    return weather.getCity(args[1])
  },

  callGetMap (...args) {
    return weather.getMap(args[1])
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
}

export default {
  state,
  actions,
  mutations
}
