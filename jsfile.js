var unitIsCelcius = true;
var globalForecast = [];

var data = '{"coord":{"lon":77.59,"lat":12.98},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"base":"stations","main":{"temp":304.8,"pressure":1011,"humidity":43,"temp_min":303.71,"temp_max":306.15},"visibility":10000,"wind":{"speed":1,"deg":340},"clouds":{"all":40},"dt":1558179498,"sys":{"type":1,"id":9205,"message":0.0054,"country":"IN","sunrise":1558139032,"sunset":1558184907},"id":1277333,"name":"Bengaluru","cod":200}';


$(function(){
  getClientPosition();
  startClock();  
  document.getElementById("humidity").innerHTML="45";
  document.getElementById("precipitation").innerHTML="0";
  document.getElementById("wind").innerHTML="4.73";
  document.getElementById("sunrise").innerHTML="5.49am";
  document.getElementById("sunset").innerHTML="6.34pm";
  document.getElementById("cloud").innerHTML="44";
  document.getElementById("dew").innerHTML="10";
});


function startClock(){
  setInterval(function(){
    $("#localTime").text(new Date().toLocaleTimeString());
  }, 1000);
}


function getClientPosition(){

  $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=3617f87cdfb13c8f1541d6a2c7700a07", function(position) {
    console.log(position);
    $("#cityName").text(position.city);
    $("#cityCode").text(position.country);
    
    getWeatherData(position.latitude, position.longitude);

  });
}


function getWeatherData(latitude, longitude){
  $.ajax({
    type: "POST",
    url: "https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=3617f87cdfb13c8f1541d6a2c7700a07" ,
    cache: true,
    headers: {
      "Access-Control-Allow-Headers": "x-requested-with"
    },
    success: function(forecast){
      console.log(forecast);
      globalForecast = forecast;
      updateForecast(forecast);

    },
    error: function(error){
      console.log("Error with ajax: "+ error);
    }
  });
}


function updateForecast(forecast){


  document.getElementById("city-name").innerHTML="BANGALORE";


  var today = forecast.list[0];
  $("#tempDescription").text(toCamelCase(today.weather[0].description));
  $("#humidity").text(today.humidity);
  $("#wind").text(today.speed);
  $("#localDate").text(getFormattedDate(today.dt));
  $("#main-icon").addClass(weatherIconsMap[today.weather[0].icon]);
  $("#mainTemperature").text(Math.round(today.temp.day));
  $("#mainTempHot").text(Math.round(today.temp.max));
  $("#mainTempLow").text(Math.round(today.temp.min));


  for(var i = 1; i < (forecast.list).length; i++){
    var day = forecast.list[i];

    

    var weatherIcon = weatherIconsMap[day.weather[0].icon];

    $("#forecast-day-" + i + "-name").text(dayName);
    $("#forecast-day-" + i + "-icon").addClass(weatherIcon);
    $("#forecast-day-" + i + "-main").text(Math.round(day.temp.day));
    $("#forecast-day-" + i + "-ht").text(Math.round(day.temp.max));
    $("#forecast-day-" + i + "-lt").text(Math.round(day.temp.min));
  }
}


$("#refreshButton").on("click", function(){
  $("#refreshButton").html("<i class='fa fa-refresh fa-spin fa-fw'></i>");
  getWeatherData();
});


// Celcius button handler.

$("#celcius").on("click", function(){
  if(!unitIsCelcius){
    $("#farenheit").removeClass("active");
    this.className = "active";

    var today = globalForecast.list[0];
    today.temp.day = toCelcius(today.temp.day);
    today.temp.max = toCelcius(today.temp.max);
    today.temp.min = toCelcius(today.temp.min);
    globalForecast.list[0] = today;

    // week
    for(var i = 1; i < 5; i ++){
      var weekDay = globalForecast.list[i];
      weekDay.temp.day = toCelcius(weekDay.temp.day);
      weekDay.temp.max = toCelcius(weekDay.temp.max);
      weekDay.temp.min = toCelcius(weekDay.temp.min);
      globalForecast[i] = weekDay;
    }

    updateForecast(globalForecast);

    unitIsCelcius = true;
  }
});


// Farenheit button handler

$("#farenheit").on("click", function(){  
  if(unitIsCelcius){
    $("#celcius").removeClass("active");
    this.className = "active";
    
    var today = globalForecast.list[0];
    today.temp.day = toFerenheit(today.temp.day);
    today.temp.max = toFerenheit(today.temp.max);
    today.temp.min = toFerenheit(today.temp.min);
    globalForecast.list[0] = today;

    for(var i = 1; i < 5; i ++){
      var weekDay = globalForecast.list[i];
      weekDay.temp.day = toFerenheit(weekDay.temp.day);
      weekDay.temp.max = toFerenheit(weekDay.temp.max);
      weekDay.temp.min = toFerenheit(weekDay.temp.min);
      globalForecast[i] = weekDay;
    }

    updateForecast(globalForecast);
    
    unitIsCelcius = false;
  }
});


function getFormattedDate(date){
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date * 1000).toLocaleDateString("en-US",options);
}


function toCamelCase(str) {
  var arr = str.split(" ").map(
    function(sentence){
      return sentence.charAt(0).toUpperCase() + sentence.substring(1);
    }
  );
  return arr.join(" ");
}


function toCelcius(val){
  return Math.round((val - 32) * (5/9));
}


function toFerenheit(val){
  var degrees = (val * 1.8) + 32;
  var rounded = Math.round(degrees);
  return rounded;
}