import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onType, DEBOUNCE_DELAY));

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages `
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function onType(evt) {
  const inputValue = evt.target.value.trim();
  if (inputValue == '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.failure(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length === 1) {
        renderOneCounty(countries);
        return;
      }
      renderCountriesList(countries);
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.warning('Oops, there is no country with that name');
    });
}

function renderCountriesList(countries) {
  refs.countryInfo.innerHTML = '';

  const markup = countries
    .map(country => {
      return `<li>
      <img width="30" src="${country.flags.svg}" alt="${country.name.official}">
      <p>${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;

  refs.countryList.style.listStyleType = 'none';
  refs.countryList.style.paddingLeft = '10px';
}

function renderOneCounty(countries) {
  refs.countryList.innerHTML = '';

  const markup = countries.map(country => {
    return `<img width="30" src="${country.flags.svg}" alt="${
      country.name.official
    }">
      <p>${country.name.official}</p>
      <p>${country.capital}</p>    
      <p>${country.population}</p>
      <p>${Object.values(country.languages).join(', ')}</p>`;
  });

  refs.countryInfo.innerHTML = markup;
}
