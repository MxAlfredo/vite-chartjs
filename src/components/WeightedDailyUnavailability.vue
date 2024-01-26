<!-- Dados problemas con TS, se opto por JS -->
<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { opcionesDisponibilidad, opcionesDecimales } from "../utils/Constants";
import { response, responseTwo } from "../mock/WeightedDailyUnavailability";
import { externalTooltipPercentage, extraLegendSpacePlugin, htmlLegendPlugin } from '../utils/chartjs';

const colorLine = '#F8CD51';
let myChart = null;

const typeDisponibilidad = ref(opcionesDisponibilidad.Disponibilidad);
const numberOfDecimals = ref(opcionesDecimales.Dos);
const changeValues = ref(false);


const labels = [];
const values = [];

response.values.forEach(row => {
  labels.push(row.day);
  values.push(row.value);
});

const data = {
  labels,
  datasets: [
    {
      label: `${typeDisponibilidad.value} desponerada del día`,
      data: values,
      backgroundColor: colorLine,
      borderColor: colorLine,
      pointStyle: false,
    },
  ]
};


const generateChart = () => {
  const config = {
    type: 'line',
    data: data,
    responsive: true,
    options: {
      interaction: {
        intersect: false,
        mode: 'nearest',
        axis: 'xy',
      },
      plugins: {
        htmlLegend: {
          containerID: 'legendContainerWDU',
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: externalTooltipPercentage,
        }
      },
      scales: {
        x: {
          grid: {
            lineWidth: 0,
          },
          title: {
            text: 'N° día del mes',
            display: true,
          },
        },
        y: {
          grid: {
            lineWidth: 0,
          },
          ticks: {
            callback: (value) => {
              const decimals = parseFloat(value.toString()).toFixed(numberOfDecimals.value);
              return `${decimals} %`;
            }
          },
          title: {
            text: `% ${typeDisponibilidad.value}.`,
            display: true,
          },
        },
      },
    },
    plugins: [
      extraLegendSpacePlugin,
      htmlLegendPlugin,
    ],

  };

  const ctx = document.getElementById('weightedDailyUnavailability');
  myChart = new Chart(ctx, config);
}

onMounted(() => {
  generateChart();
});

const updateChart = (chart, labels, newData) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = newData;
  chart.data.datasets[0].label = `${typeDisponibilidad.value} desponerada del día`;
  chart.options.plugins.title.text = `${typeDisponibilidad.value} del día desponerado`;
  chart.options.scales.y.ticks.callback = (value) => {
    const decimals = parseFloat(value.toString()).toFixed(numberOfDecimals.value);
    return `${decimals} %`;
  }
  chart.options.scales.y.title.text = `% ${typeDisponibilidad.value}.`;
  chart.update();
}

watch([typeDisponibilidad, numberOfDecimals], () => {
  changeValues.value = !changeValues.value;
  if (changeValues.value) {
    const labels = responseTwo.values.map(row => row.day);
    const values = responseTwo.values.map(row => row.value);
    updateChart(myChart, labels, values);
  } else {
    updateChart(myChart, labels, values);
  }
});
</script>

<template>
  <label for="typeDisponibilidadWDU">Tipo de disponibilidad</label>
  <select v-model="typeDisponibilidad" id="typeDisponibilidadWDU">
    <option v-for="option in opcionesDisponibilidad" :key="option">
      {{ option }}
    </option>
  </select>

  <label for="numberOfDecimalsWDU">Número de decimales</label>
  <select v-model="numberOfDecimals" id="numberOfDecimalsWDU">
    <option v-for="option in opcionesDecimales" :key="option">
      {{ option }}
    </option>
  </select>

  <div class="chart-container">
    <div class="chart-title"> {{ typeDisponibilidad }} del día desponerado </div>
    <div id="legendContainerWDU"></div>
    <canvas id="weightedDailyUnavailability"> </canvas>
  </div>
</template>

<style scoped>
.chart-container {
  height: auto;
  width: 800px;
}
.chart-title {
  font-size: .8rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
  color: rgb(102, 102, 102);
}
</style>
