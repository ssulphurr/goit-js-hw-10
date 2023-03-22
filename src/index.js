import './css/styles.css';
import debounce from 'lodash.debounce';

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
  fetchCountries(evt.target.value)
    .then(countries => renderCountriesList(countries))
    .catch(error => console.log(error));
}

function renderCountriesList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
            <p>${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}
