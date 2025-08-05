import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';



dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL 
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected!'))
  .catch(err => console.log('Database error:', err));

const WeatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  condition: String,
  date: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', WeatherSchema);

// this api is getting weather data from Openweatherapi and saving it to mongoDB
app.post('/weather', async (req, res) => {
  try {
    const cityName = req.body.city;
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const weatherData = response.data;
    
    const newWeather = new Weather({
      city: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main
    });
    
    await newWeather.save();
    
    res.json({
      city: newWeather.city,
      temperature: newWeather.temperature,
      condition: newWeather.condition,
      date: newWeather.date
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});


// This api is geeting history of the weather from database
app.get('/weather/:city', async (req, res) => {
  try {
    const cityName = req.params.city;
    
    const weatherList = await Weather.find({ 
      city: new RegExp(cityName, 'i') 
    }).sort({ date: -1 });
    
    res.json(weatherList);
    
  } catch (error) {
    res.status(500).json({ error: 'Could not get weather history' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});