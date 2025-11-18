const URL = "https://aquaiotapp.onrender.com";
const TIME_INTERVAL = 30000; // 30 segundos
const API = `${URL}/api/v1/sensors/all`;
const API_COMMAND = `${URL}/api/v1/sensors/actuator/command`;

// Arrays para almacenar los datos
let labels = [];
let tempData = [];
let phData = [];
let oxygenData = [];
let turbData = [];

// Crear charts
const chartTemp = new Chart(document.getElementById("chartTemp"), {
    type: "line",
    data: {
        labels,
        datasets: [{
            label: "Temperatura (°C)",
            data: tempData,
            borderColor: "rgba(255, 165, 0, 1)",
            backgroundColor: "rgba(255, 165, 0, 0.25)"
        }]
    }
});

const chartPH = new Chart(document.getElementById("chartPH"), {
    type: "line",
    data: {
        labels,
        datasets: [{
            label: "pH",
            data: phData,
            borderColor: "rgba(102, 255, 102, 1)",
            backgroundColor: "rgba(102, 255, 102, 0.3)"
        }]
    }
});

const chartOxygen = new Chart(document.getElementById("chartOxygen"), {
    type: "line",
    data: {
        labels,
        datasets: [{
            label: "Oxígeno (mg/L)",
            data: oxygenData,
            borderColor: "rgba(255, 80, 80, 1)",
            backgroundColor: "rgba(255, 80, 80, 0.3)"
        }]
    }
});

const chartTurb = new Chart(document.getElementById("chartTurb"), {
    type: "line",
    data: {
        labels,
        datasets: [{
            label: "Turbidez (NTU)",
            data: turbData,
            borderColor: "rgba(0, 153, 255, 1)",   
            backgroundColor: "rgba(0, 153, 255, 0.3)"
        }]
    }
});

async function toggleActuator(sensor, newState) {
    console.log(`Cambiando estado del actuador ${sensor} a ${newState}`);
    await fetch(API_COMMAND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensor, value: newState })
    });
}

async function updateCharts() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        if (!data.sensors) return;

        // Tiempo actual para las etiquetas (ejemplo hh:mm:ss)
        const now = new Date().toLocaleTimeString();

        labels.push(now);
        if (labels.length > 20) labels.shift(); // Mantener máximo 20 puntos

        // Actualizar arrays según tipo de sensor
        data.sensors.forEach(sensor => {
            const { type, value } = sensor;

            if (type === "temperature") {
                tempData.push(value);
                if (tempData.length > 20) tempData.shift();
            }

            if (type === "ph") {
                phData.push(value);
                if (phData.length > 20) phData.shift();
            }

            if (type === "oxygen") {
                oxygenData.push(value);
                if (oxygenData.length > 20) oxygenData.shift();
            }

            if (type === "turbidity") {
                turbData.push(value);
                if (turbData.length > 20) turbData.shift();
            }
        });

        // Refrescar charts
        chartTemp.update();
        chartPH.update();
        chartOxygen.update();
        chartTurb.update();

    } catch (error) {
        console.error("Error actualizando gráficos:", error);
    }
}

async function loadAllSensors() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        console.log("Datos recibidos:", data);

        // Verifica formato
        if (!data.sensors || !Array.isArray(data.sensors)) {
            console.error("Formato inválido:", data);
            return;
        }

        data.sensors.forEach(sensor => {
            const { type, value, actuator } = sensor;

            // Actualizar valores en pantalla
            const valueElement = document.getElementById(`${type}Value`);
            if (valueElement) {
                valueElement.textContent = value;
            }

            // Actualizar switch de actuador
            const switchElement = document.getElementById(`${type}Switch`);
            if (switchElement) {
                switchElement.checked = actuator;
            }
        });

    } catch (error) {
        console.error("Error al cargar sensores:", error);
    }
}

let INTERVAL_LOAD_ALL = null;
let INTERVAL_UPDATE_CHARTS = null;
let realtimeEnabled = false;

function startRealtime(interval) {

    stopRealtime();

    INTERVAL_LOAD_ALL = setInterval(loadAllSensors, interval);
    INTERVAL_UPDATE_CHARTS = setInterval(updateCharts, interval);

    realtimeEnabled = true;

    console.log("⏱ Tiempo real ACTIVADO con intervalo:", interval);
}

function stopRealtime() {

    if (INTERVAL_LOAD_ALL) clearInterval(INTERVAL_LOAD_ALL);
    if (INTERVAL_UPDATE_CHARTS) clearInterval(INTERVAL_UPDATE_CHARTS);

    INTERVAL_LOAD_ALL = null;
    INTERVAL_UPDATE_CHARTS = null;

    realtimeEnabled = false;

    console.log("🚫 Tiempo real DESACTIVADO");
}

const btnToggle = document.getElementById("btnToggleRealtime");
const statusBadge = document.getElementById("realtimeStatus");
const intervalSelector = document.getElementById("intervalSelector");

btnToggle.addEventListener("click", () => {
    const interval = parseInt(intervalSelector.value);

    if (!realtimeEnabled) {
        startRealtime(interval);
        btnToggle.classList.replace("btn-success", "btn-danger");
        btnToggle.innerText = "✖ Desactivar tiempo real";

        statusBadge.classList.replace("text-bg-secondary", "text-bg-success");
        statusBadge.innerText = "Estado: Activo";

    } else {
        stopRealtime();
        btnToggle.classList.replace("btn-danger", "btn-success");
        btnToggle.innerText = "✔ Activar tiempo real";

        statusBadge.classList.replace("text-bg-success", "text-bg-secondary");
        statusBadge.innerText = "Estado: Inactivo";
    }
});

intervalSelector.addEventListener("change", () => {
    if (realtimeEnabled) {
        const newInterval = parseInt(intervalSelector.value);
        console.log("🔄 Nuevo intervalo aplicado:", newInterval);
        startRealtime(newInterval); // Reinicia con el nuevo tiempo
    }
});

updateCharts();
loadAllSensors();