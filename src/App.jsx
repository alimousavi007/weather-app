import { useEffect, useState } from 'react';

// متغیر API Key را بیرون از کامپوننت تعریف می‌کنیم چون وابسته به رندر نیست
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState(null); //

  useEffect( () =>{
    if(!city) return;
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`)      
          if(!response.ok) throw new Error("داده‌ای دریافت نشد. دوباره تلاش کنید.");
          const data = await response.json();
          setWeatherData(data);
          setCity(data.name);
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
        }
        finally{
          setIsLoading(false);
        }
    };
    fetchWeather();
  },[city])

  const fetchByCoords = async (lat, lon) =>{
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fa`);
      if(!response.ok) throw new Error("داده‌ای دریافت نشد. لطفا دوباره امتحان کنید.");
      const data = await response.json();
      setCity(data.name);
      setIsLoading(false);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect( () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( (position) =>{
        const {latitude, longitude} = position.coords;
        fetchByCoords(latitude, longitude);
      },(err) => {
        setCity('Mashhad');
        setError(err.message);
      }
      );
    }
  },[]); 
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setCity(query);
      setQuery('');
    }
  };

  const handleLocationClick = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) =>{
        const {latitude, longitude} = position.coords;
        fetchByCoords(latitude,longitude);
      },(err) =>{
        setError(err.message);
      }
    );
    }
  };

  return (
    // کانتینر اصلی صفحه
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4 font-sans">
      
      {/* فرم جستجو */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm mb-8 flex gap-2">
        <input 
          type="text" 
          placeholder="نام شهر ..." 
          
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="w-full p-3 bg-white/30 text-white placeholder-white/70 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
        />
        <button type="submit" className="p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors">
          🔍
        </button>
        <button title="موقعیت مکانی من " type='button' className='bg-white/30 p-3 rounded-lg hover:bg-white/40 transition-colors' onClick={handleLocationClick}>
        🎯
        </button>
      </form>

      {/* بخش نمایش محتوا */}
      <div className="w-full max-w-sm">
        {isLoading && <div className='text-white text-center text-2xl animate-pulse'>در حال دریافت اطلاعات...</div>}
        
        {error && <div className='text-white text-center text-xl bg-red-500/50 rounded-lg p-4'><h3>خطا</h3><p>{error}</p></div>}
        
        {weatherData && !isLoading && !error && (
          <div className='bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white animate-fade-in'>
            {/* بخش بالایی کارت */}
            <div className='text-center mb-6'>
              <h2 className='text-4xl font-bold'>{weatherData.name}</h2>
              <p className='text-md font-light text-white/80'>{weatherData.sys.country}</p>
            </div>
            
            {/* بخش میانی کارت */}
            <div className='flex items-center justify-center my-6'>
              <span className='text-8xl font-semibold'>{Math.round(weatherData.main.temp)}°C</span>
              <div className='text-center ml-4'>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} className="w-20 h-20" />
                <p className='text-md capitalize'>{weatherData.weather[0].description}</p>
              </div>
            </div>
            
            {/* بخش پایینی کارت */}
            <div className='space-y-4 text-sm'>
              <div className='flex justify-between items-center bg-white/10 p-2 rounded-lg'>
                <span className='font-light'>🌡️ حس واقعی دما</span>
                <span className='font-semibold'>{Math.round(weatherData.main.feels_like)}°</span>
              </div>
              <div className='flex justify-between items-center bg-white/10 p-2 rounded-lg'>
                <span className='font-light'>💧 رطوبت</span>
                <span className='font-semibold'>{weatherData.main.humidity}%</span>
              </div>
              <div className='flex justify-between items-center bg-white/10 p-2 rounded-lg'>
                <span className='font-light'>💨 سرعت باد</span>
                <span className='font-semibold'>{weatherData.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;