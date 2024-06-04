import { useEffect, useState } from "react";
import { getWeatherByCoordinates } from "../weatherApi";
import css from "./WeatherWidget.module.css";
import Loader from "../Loader/Loader";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await getWeatherByCoordinates(latitude, longitude);
          setWeather(weatherData);
        } catch (error) {
          setError("Failed to fetch weather data");
        }
      });
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const getWeatherAdvice = () => {
    if (!weather) return "";
  
    const temp = weather.main.temp;
    const description = weather.weather[0].description.toLowerCase();
  
    if (description.includes("rain")) {
      return "На вулиці дощик, але доставка завжди поруч";
    } else if (description.includes("thunderstorm")) {
      return "Гроза не завадить доставити вам суші";
    } else if (description.includes("snow")) {
      return "Ніщо не доповнює зимовий настрій так, як суші";
    } else if (description.includes("fog") || description.includes("mist")) {
      return "Допоможемо розвіяти туман вашої душі";
    } else if (description.includes("clear")) {
      return "Прекрасний день, щоб замовити щось акційне";
    } else if (description.includes("cloud")) {
      if (description.includes("partly")) {
        return "Невеликий шанс опадів, можна і до нас завітати";
      } else {
        return "Можливо буде дощ, краще замовити доставку";
      }
    } else if (temp < 0) {
      return "Мінус за вікном, але з нами завжди плюс";
    } else if (temp > 30) {
      return "Спека така, от би чогось холодненького";
    } else {
      return "Саме час щось купити";
    }
  };

  if (error) {
    return <div className={css.weatherWidget}>Error: {error}</div>;
  }

  if (!weather) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className={css.weatherWidget}>
      <img src={iconUrl} className={css.weatherIcon} alt="Weather Icon" />
      <div className={css.dataContainer}>
        <p className={css.temperature}>{weather.main.temp}°C</p>
        <p className={css.advice}>{getWeatherAdvice()}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
