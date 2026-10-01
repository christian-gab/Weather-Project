const searchForm  = document.getElementById('search-form');
const cityInput   = document.getElementById('city-input');
const alertBox    = document.getElementById('alert-box');
const loader      = document.getElementById('loader');
const weatherCard = document.getElementById('weather-card');

document.getElementById('year').textContent = new Date().getFullYear();

const API_KEY = '6ec4b5e46e5fc2a8e54e202b8d09fd72';

function getFormattedDate() {
    return new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function msToKmh(ms) {
    return Math.round(ms * 3.6);
}

function showWeather(data) {
    document.getElementById('city-title').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('date-label').textContent = getFormattedDate();
    document.getElementById('temp-value').innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
    document.getElementById('temp-description').textContent = data.weather[0].description;
    document.getElementById('temp-max').innerHTML = `${Math.round(data.main.temp_max)}<sup>°C</sup>`;
    document.getElementById('temp-min').innerHTML = `${Math.round(data.main.temp_min)}<sup>°C</sup>`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${msToKmh(data.wind.speed)} km/h`;

    const iconEl = document.getElementById('temp-img');
    iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    iconEl.alt = data.weather[0].description;

    weatherCard.classList.add('show');
}

function hideWeather() {
    weatherCard.classList.remove('show');
}

function showAlert(message) {
    alertBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
}

function clearAlert() {
    alertBox.innerHTML = '';
}

function setLoading(isLoading) {
    loader.setAttribute('aria-hidden', String(!isLoading));
    loader.classList.toggle('visible', isLoading);
}

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const cityValue = cityInput.value.trim();

    if (!cityValue) {
        hideWeather();
        showAlert('Por favor, insira o nome de uma cidade.');
        return;
    }

    clearAlert();
    hideWeather();
    setLoading(true);

    const apiUrl =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(cityValue)}` +
        `&appid=${API_KEY}` +
        `&units=metric` +
        `&lang=pt_br`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            showWeather(data);
            clearAlert();
        } else if (response.status === 404) {
            showAlert('Cidade nao encontrada. Verifique o nome e tente novamente.');
        } else if (response.status === 401) {
            showAlert('Chave de API invalida. Contate o administrador.');
        } else {
            showAlert(`Erro inesperado (${response.status}). Tente novamente.`);
        }
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        showAlert('Falha na conexao. Verifique sua internet e tente novamente.');
    } finally {
        setLoading(false);
    }
});
