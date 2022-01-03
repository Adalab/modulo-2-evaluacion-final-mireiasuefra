'use strict';

// -- Variables -- //

//arrays//
let seriesAnime = [];
// para el LocalStorage, relleno el array de fav con las seleccoionadas y para que no me de null le doy la opcion de que elija una u otra. Para que me lo pinte desde el principio (si fuera necesario) tengo que llamar a la funcion de pintado desde el principio.
let favouriteSeriesAnime = JSON.parse(localStorage.getItem('favourites')) || [];

//resto de variables//
const apiUrl = 'https://api.jikan.moe/v3/search/anime';

const listSeries = document.querySelector('.js-list-series');
const listSeriesFavourite = document.querySelector('.js-list-series-favourite');

const inputSearch = document.querySelector('.js-search_series');
const btnSearch = document.querySelector('.js-btn-search');
const btnReset = document.querySelector('.js-btn-reset-search');

const btnResetFav = document.querySelector('.js-favourites__btn-reset');

// -- Funciones -- //

function setLocalStorage() {
  localStorage.setItem('favourites', JSON.stringify(favouriteSeriesAnime));
}

function getUrlImg(serie) {
  return serie.image_url ||
    'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
}

//traen codigo del html//
function getHtmlSerie(serie) {
  const urlImg = getUrlImg(serie);

  let htmlCode = `<li class="serie js-selectorSeriesFavourites" data-id="${serie.mal_id}">`;
  htmlCode += `  <h2 class="serie__title">${serie.title}</h2>`;
  htmlCode += `  <img class="serie__img js-img-series" src="${urlImg}"`;
  htmlCode += `    alt="no existe imagen">`;
  htmlCode += `</li>`;

  return htmlCode;
}

function getHtmlSerieFavourite(serie) {
  const urlImg = getUrlImg(serie);

  let htmlCode = `<li class="serie-favourite">`;
  htmlCode += `  <h2 class="serie-favourite__title">${serie.title} <span class="delete-fav js-deleteFav" data-id="${serie.mal_id}">x</span></h2>`;
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
    listSeries.innerHTML = 'Serie no encontrada, prueba con otra';
  }
  listenAddSerie(); // lo meto aqui xq ya han pintado las series.
}

function paintListFavouriteSeries() {
  listSeriesFavourite.innerHTML = '';
  for (let index = 0; index < favouriteSeriesAnime.length; index++) {
    const serie = favouriteSeriesAnime[index];
    listSeriesFavourite.innerHTML += getHtmlSerieFavourite(serie);
  }
  listenRemoveFavourite(); // lo meto aqui xq ya han pintado las series fav.
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

// para añadir funcionalidad a la X que he puesto en la lista de fav y poder eliminar los que queramos.
function listenRemoveFavourite() {
  const selectorSerieFavourite = document.querySelectorAll('.js-deleteFav');
  // Añadir los listener
  for (let index = 0; index < selectorSerieFavourite.length; index++) {
    const element = selectorSerieFavourite[index];
    element.addEventListener('click', removeSeriesFavourites);
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
  // guardo en local con stringify el array de favoritos. Lo guardo cuando hay modificacion en la lista.
  setLocalStorage();
  //pinto las series favoritas
  paintListFavouriteSeries();
}

// repito la funcion de añadir series con las modificaciones necesarias para que se eliminen series en vez de añadirlas. Apoyandome en el .findindex (necesito la posicion) y el splice (que me da la opcion de eliminar)
function removeSeriesFavourites(ev) {
  const serieId = parseInt(ev.currentTarget.dataset.id);
  const serieFavIndex = favouriteSeriesAnime.findIndex(
    (serie) => serie.mal_id === serieId
  );

  if (serieFavIndex >= 0) {
    favouriteSeriesAnime.splice(serieFavIndex, 1);
  }
  // vuelvo a guardar el local ya que hay modificaciones.
  setLocalStorage();
  //vuelvo a pintar.
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
    });
}


// Reset - con esta funcion se pueden resetear de golpe todas las favoritas.
function handleClickReset() {
  seriesAnime = [];
  inputSearch.value = '';
  //vuelvo a pintar las lista.
  paintListSeries();
}

function handleClickResetFav() {
  favouriteSeriesAnime = [];
  // vuelvo a guardar el local ya que hay modificaciones.
  setLocalStorage();
  //vuelvo a pintar las lista de fav
  paintListFavouriteSeries();
}

// -- Listener -- //

btnSearch.addEventListener('click', searchSeries);
btnReset.addEventListener('click', handleClickReset);
btnResetFav.addEventListener('click', handleClickResetFav);
//llamo a la funcion de pintado desde el principio para que me salgan las favoritas.
paintListFavouriteSeries();
