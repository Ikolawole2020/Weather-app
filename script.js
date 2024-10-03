const userLocation = document.getElementById('userLocation');
const converter = document.getElementById('converter')

weatherIcon = document.querySelector('.weatherIcon')
temperature = document.querySelector('.temperature')
feelsLike = document.querySelector('.feelsLike')
description = document.querySelector('.description')
date = document.querySelector('.date')
city = document.querySelector('.city')

// Get elements from the DOM
const HValue = document.getElementById('HValue');
const WValue = document.getElementById('WValue');
const SRValue = document.getElementById('SRValue');
const SSValue = document.getElementById('SSValue');
const CValue = document.getElementById('CValue');
const UVValue = document.getElementById('UVValue');
const PValue = document.getElementById('PValue');
const Forecast = document.querySelector('.Forecast');

// Define API endpoints
const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const DATA_ENDPOINT = 'https://api.openweathermap.org/data/2.5/onecall';

// Define API key
const API_KEY = 'a5bb4718b30b6f58f58697997567fffa';

// Function to find user location
function findUserLocation() {
    Forecast.innerHTML="";
  const userLocation = document.getElementById('userLocation').value;
  const url = `${API_ENDPOINT}?q=${userLocation}&appid=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        alert(data.message);
        return;
      }
      console.log(data);
      city.innerHTML = data.name + ", "+data.sys.country;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`

      const lon = data.coord.lon;
      const lat = data.coord.lat;
      const url = `${DATA_ENDPOINT}?lon=${lon}&lat=${lat}&appid=${API_KEY}&exclude=minutely&units=metric`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            temperature.innerHTML = TemConverter(data.current.temp);
            feelsLike.innerHTML = "Feels Like" + data.current.feels_like;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;` + data.current.weather[0].description;

            const options = {
                weekday:"long",
                month:"long",
                day:"numeric",
                hour:"numeric",
                minute:"numeric",
                hour12:true,
            };

            date.innerHTML = getLongFormatDateTime(data.current.dt,data.timezone_offset,options);

            HValue.innerHTML = Math.round(data.current.humidity)+"<span>%</span>"
            WValue.innerHTML = Math.round(data.current.wind_speed)+"<span>%</span>"
            const options1={
                hour:"numeric",
                minute: "numeric",
                hour12: true,
            }
             SRValue.innerHTML = getLongFormatDateTime(data.current.sunrise,data.timezone_offset,options1);
             SSValue.innerHTML = getLongFormatDateTime(data.current.sunset,data.timezone_offset,options1);

            CValue.innerHTML =data.current.clouds+"<span>%</span>";
            UVValue.innerHTML = data.current.uvi;
            PValue.innerHTML = data.current.pressure+"<span>hPa</span>";

            data.daily.forEach((weather) => {
                let div = document.createElement("div");

                const options={
                    weekday:'long',
                    month:'long',
                    day:'numeric'
                };
                let daily = getLongFormatDateTime(weather.dt, 0, options).split(" at ");

                div.innerHTML = daily[0]

                div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />`;

                div.innerHTML += `<p class="forecast.desc">${weather.weather[0].description}</p>`

                div.innerHTML+=`<span><span>${TemConverter(weather.temp.min)}</span>&nbsp;&nbsp<span>${TemConverter(weather.temp.max)}</span></span>`

                Forecast.append(div);
              });
        })
        // .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}
function formartUnixTime(dtValue, offsset, options={}){
    const date = new Date((dtValue + offsset) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options })
}
function getLongFormatDateTime(dtValue, offset, options){
    return formartUnixTime(dtValue,offset,options)
}
function TemConverter(temp){
    let tempValue=Math.round(temp);
    let message = "";
    if(converter.value=="°C"){
        message=tempValue+"<span>"+"\xB0C</span>";
    }
    else{
        let ctof=(tempValue*9)/5+32;
        message=ctof+"<span>"+"\xB0F</span>";
    }
    return message;
}


