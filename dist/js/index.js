const API_KEY = "e8764e0f5edb9472c7ecff37c251fa0d";
const INITIAL_PROVINCE = "buenosaires";
const form = document.getElementById("form-places");
const selectCities = document.getElementById("select-cities");
const tableInfo = document.getElementById("table-info");

const getData = async (province) => {
  const dataFile = await fetch(`provinces/${province}.json`);
  const dataFromFile = await dataFile.json();
  return dataFromFile;
};

const redrawCitiesList = (province) => {
  getData(province).then((data) => {
    const newSelectCities = document.createElement("select");
    newSelectCities.classList = "form-places__cities";
    newSelectCities.id = "select-cities";
    data.forEach((element) => {
      const optionList = document.createElement("option");
      optionList.value = element.id;
      optionList.textContent = element.name;
      newSelectCities.appendChild(optionList);
    });
    if (form.length > 1) {
      form.replaceChild(newSelectCities, form[1]);
    } else form.appendChild(newSelectCities);
  });
};

const apiConsult = async (id) => {
  const dataFromOpenWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${API_KEY}&units=metric&lang=sp`
  );
  const jsonData = await dataFromOpenWeather.json();
  return jsonData;
};

window.addEventListener("load", () => {
  redrawCitiesList(INITIAL_PROVINCE);
});

form.addEventListener("change", (e) => {
  if (e.target.classList.contains("form-places__province")) {
    redrawCitiesList(e.target.value);
  }
  if (e.target.classList.contains("form-places__cities")) {
    //console.log(e.target.value);

    apiConsult(e.target.value).then((result) => {
      //console.dir(tableInfo);

      tableInfo.cells[0].innerHTML = result.main.temp;
      tableInfo.cells[1].innerHTML = result.weather[0].description;
      tableInfo.cells[2].innerHTML = `<img class="weather-icon" src="http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png" alt="weather icon" >`;
      //console.log(result);
    });
  }
});
