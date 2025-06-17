
async function cargarNoticiasAlphaVantage() {
    const ulNoticias = document.getElementById('noticias');

    ulNoticias.innerHTML = '<li>Cargando noticias...</li>';

    const URL = "https://www.alphavantage.co/query?";
    const API_KEY = "WPHHLLBSYQ0AXUFD";
    const FUNCTION = "NEWS_SENTIMENT";
    const TICKERS = "COIN,CRYPTO:BTC,FOREX:USD";
    const SORT = "LATEST";
    const LIMIT = 5;

    const url = `${URL}function=${FUNCTION}&tickers=${TICKERS}&sort=${SORT}&limit=${LIMIT}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.feed && data.feed.length > 0) {
            ulNoticias.innerHTML = ''; // limpio la lista

            // Uso for normal desde 0 hasta LIMIT (o menor si no hay suficientes noticias)
            for (let i = 0; i < LIMIT && i < data.feed.length; i++) {
                const noticia = data.feed[i];

                const li = document.createElement('li');
                const fecha = noticia.time_published ? new Date(noticia.time_published * 1000).toLocaleString() : 'Fecha desconocida';
                const fuente = noticia.source ? noticia.source : 'Fuente desconocida';

                li.innerHTML = `
                    <a href="${noticia.url}" target="_blank" rel="noopener noreferrer">${noticia.title}</a><br>
                    </strong>${noticia.summary}</strong><br>
                    <img src="${noticia.banner_image}"><br>
                    <small>fuente: ${fuente}</small><br>
                `;
                ulNoticias.appendChild(li);
            }
        } else {
            ulNoticias.innerHTML = '<li>No se encontraron noticias recientes.</li>';
        }
    } catch (error) {
        ulNoticias.innerHTML = '<li>Error al cargar las noticias.</li>';
        console.error('Error cargando noticias:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarNoticiasAlphaVantage();
});
