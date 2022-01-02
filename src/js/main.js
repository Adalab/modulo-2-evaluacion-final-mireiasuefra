'use strict';

console.log('>> Ready :)');

// -- Variables -- //
//arrays//
let seriesAnime = [];
let favouriteSeriesAnime = [];

//resto de variables//
const apiUrl = 'https://api.jikan.moe/v3/search/anime';

const listSeries = document.querySelector('.js-list-series');
const listSeriesFavourite = document.querySelector('.js-list-series-favourite');

const inputSearch = document.querySelector('.js-search_series');
const btnSearch = document.querySelector('.js-btn-search');
const btnReset = document.querySelector('.js-btn-reset-search');

// -- Funciones -- //

//traen codigo del html//
function getHtmlSerie(serie) {
  const urlImg =
    serie.image_url ||
    'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

  let htmlCode = `<li class="serie js-selectorSeriesFavourites" data-id="${serie.mal_id}">`;
  htmlCode += `  <h2 class="serie__title">${serie.title}</h2>`;
  htmlCode += `  <img class="serie__img js-img-series" src="${urlImg}"`;
  htmlCode += `    alt="no existe imagen">`;
  htmlCode += `</li>`;

  return htmlCode;
}

function getHtmlSerieFavourite(serie) {
  const urlImg =
    serie.image_url ||
    'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

  let htmlCode = `<li class="serie-favourite">`;
  htmlCode += `  <h2 class="serie-favourite__title">${serie.title}</h2>`;
  htmlCode += `  <img class="serie-favourite__img js-img-series" src="${urlImg}"`;
  htmlCode += `    alt="no existe imagen">`;
  htmlCode += `</li>`;

  return htmlCode;
}

// pintan //
function paintListSeries() {
  listSeries.innerHTML = '';
  if (seriesAnime) {
    for (let index = 0; index < seriesAnime.length; index++) {
      const serie = seriesAnime[index];
      listSeries.innerHTML += getHtmlSerie(serie);
    }
  } else {
    listSeries.innerHTML = 'Serie no encontrada, prueba con otra'; // si me da tiempo lo meto en otro lado, ahora lo tengo en el ul.
  }
  listenAddSerie(); // lo meto aqui xq ya han pintado las series.
}

function paintListFavouriteSeries() {
  listSeriesFavourite.innerHTML = '';
  for (let index = 0; index < favouriteSeriesAnime.length; index++) {
    const serie = favouriteSeriesAnime[index];
    listSeriesFavourite.innerHTML += getHtmlSerieFavourite(serie);
  }
}

// escuchar //
function listenAddSerie() {
  const selectorSerieFavourite = document.querySelectorAll(
    '.js-selectorSeriesFavourites'
  );
  // Añadir los listener
  for (let index = 0; index < selectorSerieFavourite.length; index++) {
    const element = selectorSerieFavourite[index];
    element.addEventListener('click', addSeriesFavourite);
  }
}

function addSeriesFavourite(ev) {
  //guardo el in en el evento con currentTarget y utilizo la propiedad .find
  const serieId = parseInt(ev.currentTarget.dataset.id);
  const serie = seriesAnime.find((serie) => serie.mal_id === serieId);
  // para que no se repita utilizo nuevamente el .find
  const serieFav = favouriteSeriesAnime.find(
    (serie) => serie.mal_id === serieId
  );

  ev.currentTarget.classList.add('now-favourite'); // para cambiar el fondo y el texto de color cuando lo seleccionemos para añadirlo a fav.


  if (serieFav === undefined) {
    favouriteSeriesAnime.push({
      title: serie.title,
      mal_id: serie.mal_id,
      image_url: serie.image_url,
    });
  }

  paintListFavouriteSeries();
}

//--Fetch--//
function searchSeries(ev) {
  ev.preventDefault();
  const searchText = inputSearch.value;
  // tengo que interpolar la url de la api con el valor del input
  fetch(`${apiUrl}?q=${searchText}`)
    .then((response) => response.json())
    .then((data) => {
      seriesAnime = data.results;
      paintListSeries();
      paintListFavouriteSeries();
    });
}

// Reset
function handleClickReset() {
  location.reload();
}

// -- Listener -- //

btnSearch.addEventListener('click', searchSeries);
btnReset.addEventListener('click', handleClickReset);
