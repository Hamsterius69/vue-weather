# WeatherApp

A modern, responsive weather application built with **Vue 3** and **Quasar Framework**. Get real-time weather data, 7-day forecasts, air quality information, and more.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![Quasar](https://img.shields.io/badge/Quasar-2.x-1976D2?style=flat-square&logo=quasar)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## Features

- **Real-time Weather Data** - Current temperature, conditions, and detailed weather information
- **7-Day Forecast** - Extended forecast with high/low temperatures and conditions
- **Air Quality Index** - Monitor air pollution levels with health recommendations
- **Geolocation** - Auto-detect your location for instant weather updates
- **City Search with Autocomplete** - Search any city worldwide with intelligent suggestions
- **Temperature Units** - Toggle between Celsius and Fahrenheit
- **Dark/Light Theme** - Adaptive theme with smooth transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation** - Full keyboard support for accessibility

## Demo

Live demo: [https://vue-weather.pages.dev](https://vue-weather.pages.dev)

## Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light Mode](docs/light-mode.png) | ![Dark Mode](docs/dark-mode.png) |

## Tech Stack

- **Frontend Framework:** Vue 3 (Composition API)
- **UI Framework:** Quasar 2
- **State Management:** Vuex 4
- **HTTP Client:** Axios
- **Icons:** Line Awesome
- **Build Tool:** Quasar CLI with Webpack

## APIs Used

| API | Purpose |
|-----|---------|
| [OpenWeatherMap](https://openweathermap.org/api) | Weather data, forecasts, and air quality |
| [LocationIQ](https://locationiq.com/) | Geocoding and autocomplete |

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Hamsterius69/vue-weather.git
cd vue-weather
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your API keys:

```env
# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key_here

# LocationIQ API
LOCATIONIQ_TOKEN=your_locationiq_token_here
```

#### Getting API Keys

1. **OpenWeatherMap API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Navigate to "API Keys" in your account
   - Generate a new key (free tier includes 1,000 calls/day)

2. **LocationIQ Token**
   - Sign up at [LocationIQ](https://locationiq.com/)
   - Get your token from the dashboard (free tier includes 5,000 requests/day)

### 4. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run build:prod` | Build SPA for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and fix issues |
| `npm run test` | Run tests |

## Project Structure

```
vue-weather/
├── public/                 # Static assets
│   ├── _headers           # Cloudflare headers configuration
│   └── _redirects         # Cloudflare redirects for SPA
├── src/
│   ├── api/               # API service layer
│   │   └── weather.js     # Weather API calls
│   ├── boot/              # Quasar boot files
│   ├── components/        # Vue components
│   │   ├── TopBar.vue
│   │   ├── WeatherSearch.vue
│   │   ├── WeatherDisplay.vue
│   │   ├── WeatherHero.vue
│   │   ├── WeatherStatCard.vue
│   │   ├── StatsGrid.vue
│   │   ├── AirQualityCard.vue
│   │   ├── ForecastSection.vue
│   │   └── ForecastCard.vue
│   ├── composable/        # Vue composables
│   │   ├── useTheme.js
│   │   ├── useWeatherDataTransform.js
│   │   └── useInputValidation.js
│   ├── css/               # Global styles
│   │   ├── app.scss
│   │   └── design-tokens.css
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── router/            # Vue Router configuration
│   └── store/             # Vuex store
├── .env.example           # Environment variables template
├── quasar.conf.js         # Quasar configuration
└── package.json
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Geocoding by [LocationIQ](https://locationiq.com/)
- UI components by [Quasar Framework](https://quasar.dev/)
- Icons by [Line Awesome](https://icons8.com/line-awesome)

---

Made with Vue.js and Quasar Framework
