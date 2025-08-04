import React, { useState } from 'react';

function WeatherApp() {
  // Simple state variables
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to get weather
  const getWeather = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, get new weather data
      const response = await fetch('http://localhost:5000/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: city })
      });

      if (response.ok) {
        const newWeather = await response.json();
        setCurrentWeather(newWeather);

        // Then get weather history
        const historyResponse = await fetch(`http://localhost:5000/weather/${city}`);
        const history = await historyResponse.json();
        setWeatherHistory(history);
        
        setCity(''); // Clear input
      } else {
        setError('City not found! Please check the spelling.');
      }
    } catch (err) {
      setError('Something went wrong! Check if the server is running.');
    }

    setLoading(false);
  };

  // Get weather emoji based on condition
  const getWeatherEmoji = (condition) => {
    const conditionLower = condition?.toLowerCase();
    if (conditionLower?.includes('clear') || conditionLower?.includes('sun')) return '☀️';
    if (conditionLower?.includes('cloud')) return '☁️';
    if (conditionLower?.includes('rain') || conditionLower?.includes('drizzle')) return '🌧️';
    if (conditionLower?.includes('snow')) return '❄️';
    if (conditionLower?.includes('thunder')) return '⛈️';
    if (conditionLower?.includes('mist') || conditionLower?.includes('fog')) return '🌫️';
    return '🌤️'; // default
  };

  // Format date to be readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header with improved styling */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: '300'
          }}>
            🌤️ Weather Dashboard
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.2rem',
            margin: '0'
          }}>
            Get real-time weather updates for any city
          </p>
        </div>

        {/* Enhanced Input Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.25)', 
          padding: '30px', 
          borderRadius: '20px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'stretch' }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., London, Tokyo, New York)"
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onKeyPress={(e) => e.key === 'Enter' && getWeather()}
              onFocus={(e) => e.target.style.transform = 'scale(1.02)'}
              onBlur={(e) => e.target.style.transform = 'scale(1)'}
            />
            <button
              onClick={getWeather}
              disabled={loading}
              style={{
                padding: '15px 30px',
                backgroundColor: loading ? 'rgba(255,255,255,0.3)' : '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? (
                <span>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></span>
                  Loading...
                </span>
              ) : (
                <>🔍 Get Weather</>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <strong>⚠️ {error}</strong>
          </div>
        )}

        {/* Enhanced Current Weather Display */}
        {currentWeather && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            padding: '40px',
            borderRadius: '25px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 30px 0', 
              color: '#2d3436',
              fontSize: '2rem',
              fontWeight: '300'
            }}>
              📍 {currentWeather.city}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                padding: '25px',
                borderRadius: '20px',
                color: 'white',
                boxShadow: '0 4px 15px rgba(116,185,255,0.3)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌡️</div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', opacity: '0.9' }}>Temperature</h3>
                <p style={{ fontSize: '2.5rem', margin: '0', fontWeight: 'bold' }}>
                  {currentWeather.temperature}°C
                </p>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #fd79a8, #e84393)',
                padding: '25px',
                borderRadius: '20px',
                color: 'white',
                boxShadow: '0 4px 15px rgba(253,121,168,0.3)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                  {getWeatherEmoji(currentWeather.condition)}
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', opacity: '0.9' }}>Condition</h3>
                <p style={{ fontSize: '1.8rem', margin: '0', fontWeight: 'bold' }}>
                  {currentWeather.condition}
                </p>
              </div>
            </div>
            
            <p style={{ 
              color: '#636e72', 
              margin: '0',
              fontSize: '1rem'
            }}>
              🕒 Updated: {formatDate(currentWeather.date)}
            </p>
          </div>
        )}

        {/* Enhanced Weather History */}
        {weatherHistory.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '40px',
            borderRadius: '25px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <h3 style={{ 
              margin: '0 0 30px 0', 
              color: '#2d3436',
              fontSize: '1.8rem',
              fontWeight: '300',
              textAlign: 'center'
            }}>
              📊 Weather History ({weatherHistory.length} records)
            </h3>
            
            <div style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {weatherHistory.map((weather, index) => (
                <div 
                  key={index}
                  style={{
                    background: index === 0 ? 'linear-gradient(135deg, #a8e6cf, #88d8a3)' : '#f8f9fa',
                    padding: '20px',
                    marginBottom: '15px',
                    borderRadius: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: index === 0 ? '2px solid #00b894' : '1px solid #e9ecef',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '2rem' }}>
                      {getWeatherEmoji(weather.condition)}
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        color: index === 0 ? 'white' : '#2d3436',
                        marginBottom: '5px'
                      }}>
                        {weather.condition}
                        {index === 0 && <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '0.8rem',
                          background: 'rgba(255,255,255,0.3)',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>Latest</span>}
                      </div>
                      <div style={{ 
                        color: index === 0 ? 'rgba(255,255,255,0.9)' : '#636e72',
                        fontSize: '0.9rem'
                      }}>
                        🕒 {formatDate(weather.date)}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    color: index === 0 ? 'white' : '#e17055'
                  }}>
                    {weather.temperature}°C
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Welcome Message */}
        {!currentWeather && !error && !loading && (
          <div style={{
            background: 'rgba(255,255,255,0.25)',
            padding: '60px 40px',
            borderRadius: '25px',
            textAlign: 'center',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌍</div>
            <h3 style={{ fontSize: '2rem', marginBottom: '15px', fontWeight: '300' }}>
              Welcome to Weather Dashboard!
            </h3>
            <p style={{ 
              fontSize: '1.2rem', 
              opacity: '0.9',
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Enter any city name above to get real-time weather information and view historical weather data.
            </p>
          </div>
        )}

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Custom scrollbar for history */
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: rgba(0,0,0,0.1);
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb {
              background: rgba(0,0,0,0.3);
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: rgba(0,0,0,0.5);
            }
          `}
        </style>

      </div>
    </div>
  );
}

export default WeatherApp;