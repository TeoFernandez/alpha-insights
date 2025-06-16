// Constantes
const API_KEY = "WPHHLLBSYQ0AXUFD";
const API_BASE = "https://www.alphavantage.co/query";

// Referencias a elementos en el DOM
const btnBuscarAccion = document.getElementById('btnBuscarAccion'); 
const txtSimbolo = document.getElementById('txtSimbolo'); 


addEventListener("DOMContentLoaded", () => {
    btnBuscarAccion.addEventListener("click", buscarAccion);
});

// Función principal
async function buscarAccion(){
    let symbol = txtSimbolo.value.trim();

    if (symbol === '') {
        alert("Ingrese un símbolo.");
        return;
    }

    // Construir URL para API (SERIE DIARIA)
    let url = `${API_BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`;

    console.log(url);
    let response = await httpMethod(url, "GET");

    if (response["Time Series (60min)"]){
        prepararGrafico(response["Time Series (60min)"], symbol);
    } else {
        console.error("Respuesta sin información.");
        alert("Sin información para el símbolo ingresado.");
    }
}

// Función para preparar el gráfica con Chart.js
function prepararGrafico(serie, symbol){

    // Extraer las horas (eje X) y el closing (eje Y).
    let labels = Object.keys(serie).reverse();
    let closing = Object.keys(serie).reverse()
                                   .map(k => parseFloat(serie[k]["4. close"]));

    // Limpia canvas antes de dibujar nuevo
    let ctx = document.getElementById('graficoAcciones').getContext('2d');

    // Destruir gráfica anterior si existe
    if (window.miGrafica) {
        window.miGrafica.destroy();
    }

    // Crear gráfica
    window.miGrafica = new Chart(ctx, {
        type:'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor de ${symbol}`,
                data: closing,
                fill: true,
                borderColor:'rgba(0, 123, 255, 1)', 
                backgroundColor:'rgba(0, 123, 255, 0.2)', 
            }]
        },
        options: {
            scales: {
                x: { 
                    display: true,
                    title: { text:'Fecha/Hora', display:true }
                },
                y: { 
                    display: true,
                    title: { text:'Valor ($)', display:true }
                }
            }
        }
    });

}

// Función genérica para peticiones
async function httpMethod(url) {
    const ret = await fetch(url);
    return ret.json();
}
