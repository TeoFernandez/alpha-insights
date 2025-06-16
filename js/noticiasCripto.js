
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

        // La data de noticias viene en data.feed (según docs)
        if (data.feed && data.feed.length > 5) {
            ulNoticias.innerHTML = ''; // limpiar

            data.feed.forEach(noticia => {
                const li = document.createElement('li');

                // El link y el título suelen estar en noticia.url y noticia.title
                // También mostramos la fuente y fecha si está disponible
                const fecha = noticia.time_published ? new Date(noticia.time_published * 1000).toLocaleString() : 'Fecha desconocida';
                const fuente = noticia.source ? noticia.source : 'Fuente desconocida';

                li.innerHTML = `
                    <a href="${noticia.url}" target="_blank" rel="noopener noreferrer">${noticia.title}</a><br>
                    <small>${fecha} - ${fuente}</small>
                `;
                ulNoticias.appendChild(li);
            });
        } else {
            ulNoticias.innerHTML = '<li>No se encontraron noticias recientes.</li>';
        }
    } catch (error) {
        ulNoticias.innerHTML = '<li>Error al cargar las noticias.</li>';
        console.error('Error cargando noticias:', error);
    }
}

// Ejecutar la carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarNoticiasAlphaVantage();
});
