'use strict';

console.log('>> Ready :)');

// -- Variables -- //
//arrays//
let series = [];
let favouriteSeries = [];
//resto de variables//
const apiUrl = 'https://api.jikan.moe/v3/search/anime';
const btnSearch = document.querySelector('.js-btn-search');
const listSeries = document.querySelector('.js-list-series');
const inputSearch = document.querySelector('.js-search_series');



// -- Funciones -- //

//traen codigo del html//
function getHtmlSerie(serie) {

  // podría hacer una variable para meterla en imagen, igual con el ||. probar.
  let htmlCode = `<li class="list-series">`;
  htmlCode += `  <h2 class="title-series">${serie.title}</h2>`;
  htmlCode += `  <img class="img-series js-img-series" src="${serie.image_url}"`;
  htmlCode += `    alt="no existe imagen">`;
  htmlCode += `</li>`;

  return htmlCode;
}

// pintan //
function paintListSeries() {
  if (series) {
    for (let index = 0; index < series.length; index++) {
      const serie = series[index];
      listSeries.innerHTML += getHtmlSerie(serie);
    }
  } else {
    listSeries.innerHTML = 'serie no encontrada, prueba con otra'; // si me da tiempo lo meto en otro lado, ahora lo tengo en el ul.
  }
}


 

//--Fetch--//
function searchSeries(ev) {
  ev.preventDefault();
  const searchText = inputSearch.value;

  fetch(`${apiUrl}?q=${searchText}`)
    .then((response) => response.json())
    .then((data) => {
      series = data.results;
      paintListSeries();
    });
}

// -- Listener -- //

btnSearch.addEventListener('click', searchSeries);
