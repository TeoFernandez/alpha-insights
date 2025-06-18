// Constantes y referencias.
const API_KEY = "WPHHLLBSYQ0AXUFD";
const API_BASE = "https://www.alphavantage.co/query";

const btnBuscarAccion = document.getElementById('btnBuscarAccion');
const txtSimbolo = document.getElementById('txtSimbolo');
const selectIntervalo = document.getElementById('intervalo');

// Event listener para el botón
btnBuscarAccion.addEventListener("click", buscarAccion);

// Función principal para buscar acción
async function buscarAccion(){
    let symbol = txtSimbolo.value.trim().toUpperCase();
    let intervalo = selectIntervalo.value;

    if (symbol === '') {
        alert("Ingrese un símbolo.");
        return;
    }

    let url = "";
    let dataKey = "";
    let functionName = "";

    if (intervalo === "5min" || intervalo === "15min" || intervalo === "60min") {
        functionName = "TIME_SERIES_INTRADAY";
        url = `${API_BASE}?function=${functionName}&symbol=${symbol}&interval=${intervalo}&apikey=${API_KEY}`;
        dataKey = `Time Series (${intervalo})`;
    } else if (intervalo === "daily") {
        functionName = "TIME_SERIES_DAILY";
        url = `${API_BASE}?function=${functionName}&symbol=${symbol}&apikey=${API_KEY}`;
        dataKey = "Time Series (Daily)";
    } else if (intervalo === "weekly") {
        functionName = "TIME_SERIES_WEEKLY";
        url = `${API_BASE}?function=${functionName}&symbol=${symbol}&apikey=${API_KEY}`;
        dataKey = "Weekly Time Series";
    } else if (intervalo === "monthly") {
        functionName = "TIME_SERIES_MONTHLY";
        url = `${API_BASE}?function=${functionName}&symbol=${symbol}&apikey=${API_KEY}`;
        dataKey = "Monthly Time Series";
    } else {
        alert("Intervalo no soportado.");
        return;
    }

    console.log("URL llamada API:", url);

    let response;
    try {
        response = await httpMethod(url);
    } catch (error) {
        alert("Error al obtener los datos.");
        console.error(error);
        return;
    }

    if (!response[dataKey]) {
        alert("No se encontraron datos para este símbolo o intervalo.");
        console.error(response);
        return;
    }

    let datosFiltrados = filtrarDatosPorIntervalo(response[dataKey], intervalo);

    prepararGrafico(datosFiltrados, symbol);
}

// Filtra los datos según el intervalo para mostrar rango deseado
function filtrarDatosPorIntervalo(data, intervalo){
    let fechas = Object.keys(data).sort(); // orden ascendente

    let hoy = new Date();
    let fechaLimite;

    switch(intervalo){
        case "5min":
        case "15min":
        case "60min":
            // Sin filtro, mostramos todo (intradía limitado por API)
            return data;

        case "daily":
            // Últimos 7 días
            fechaLimite = new Date();
            fechaLimite.setDate(hoy.getDate() - 7);
            break;

        case "weekly":
            // Último año
            fechaLimite = new Date();
            fechaLimite.setFullYear(hoy.getFullYear() - 1);
            break;

        case "monthly":
            // Histórico completo, sin filtro
            return data;

        default:
            return data;
    }

    let dataFiltrada = {};
    for(let fecha of fechas){
        let fechaObj = new Date(fecha);
        if (fechaObj >= fechaLimite){
            dataFiltrada[fecha] = data[fecha];
        }
    }
    return dataFiltrada;
}

// Prepara y dibuja el gráfico con Chart.js
function prepararGrafico(serie, symbol){
    let labels = Object.keys(serie).sort(); // ascendente para que se vea cronológico
    let closing = labels.map(k => parseFloat(serie[k]["4. close"]));

    let ctx = document.getElementById('graficoAcciones').getContext('2d');

    if (window.miGrafica) {
        window.miGrafica.destroy();
    }

    window.miGrafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor de ${symbol}`,
                data: closing,
                fill: true,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: { text: 'Fecha/Hora', display: true }
                },
                y: {
                    display: true,
                    title: { text: 'Valor ($)', display: true }
                }
            }
        }
    });
}

// Función genérica para fetch
async function httpMethod(url, method = "GET", body = null){
    if (body != null)
        body = JSON.stringify(body);

    const ret = await fetch(url, {
        method: method,
        body: body,
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const response = await ret.json();
    return response;
}
