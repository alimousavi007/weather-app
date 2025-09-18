import { useEffect, useState } from "react";
import "./App.css";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Tehran&appid=${API_KEY}&units=metric&lang=fa`
        );
        const data = await response.json();
        data.cod === 200 ? setWeatherData(data) : setError(data.message);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-white text-2xl animate-pulse">
          در حال بارگذاری...
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-white text-center text-xl bg-red-500/50 rounded-lg p-4">
          <h3>خطا</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (weatherData) {
      return (
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white w-full max-w-sm">
          {/* بخش بالایی کارت */}
          <div className="text-center">
            {/* ۳. بهبود UI: نام شهر بزرگتر و برجسته‌تر است */}
            <h2 className="text-3xl font-bold">{weatherData.name}</h2>
            <p className="text-sm font-light text-white/80">
              {weatherData.sys.country}
            </p>
          </div>

          {/* بخش میانی کارت */}
          <div className="flex items-center justify-center my-6">
            <span className="text-8xl font-semibold">
              {Math.round(weatherData.main.temp)}°
            </span>
            <div className="text-center ml-4">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
              />
              {/* ۴. بهبود UI: اضافه کردن توضیحات هوا */}
              <p className="text-sm capitalize">
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>

          {/* بخش پایینی کارت */}
          <div className="space-y-4">
            {/* ۵. بهبود UI: ساختار تمیزتر برای جزئیات */}
            <div className="flex justify-between items-center">
              <span className="font-light text-sm">🌡️ حس واقعی دما</span>
              <span className="font-semibold">
                {Math.round(weatherData.main.feels_like)}°
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-light text-sm">💧 رطوبت</span>
              <span className="font-semibold">
                {weatherData.main.humidity}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-light text-sm">💨 سرعت باد</span>
              <span className="font-semibold">
                {weatherData.wind.speed} m/s
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4 font-sans">
      {renderContent()}
    </div>
  );
}

export default App;
