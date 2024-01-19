<!-- Dados problemas con TS, se opto por JS -->
<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { opcionesDisponibilidad, opcionesDecimales } from "../mock/Constants";
import { response, responseTwo } from "../mock/WeightedDailyUnavailability";
import { externalTooltipPercentage, extraLegendSpacePlugin } from '../utils/chartjs';

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
      plugins: {
        title: {
          align: 'start',
          display: true,
          padding: {
            top: 10,
          },
          text: `${typeDisponibilidad.value} del día desponerado`,
        },
        legend: {
          align: 'start',
          labels: {
            boxHeight: 10,
            boxPadding: 10,
            boxWidth: 10,
            padding: 20,
          }
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: externalTooltipPercentage,
          // callbacks: {
          //   label: function (context) {
          //     let label = '';
          //     if (context.parsed.y !== null) {
          //       label += context.parsed.y + '%';
          //     }
          //     return label;
          //   },
          //   title: function (context) {
          //     return '';
          //   }
          // },
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
  <label for="typeDisponibilidad">Tipo de disponibilidad</label>
  <select v-model="typeDisponibilidad" id="typeDisponibilidad">
    <option v-for="option in opcionesDisponibilidad" :key="option">
      {{ option }}
    </option>
  </select>

  <label for="numberOfDecimals">Número de decimales</label>
  <select v-model="numberOfDecimals" id="numberOfDecimals">
    <option v-for="option in opcionesDecimales" :key="option">
      {{ option }}
    </option>
  </select>

  <div class="chart-container">
    <canvas id="weightedDailyUnavailability"> </canvas>
  </div>
</template>

<style scoped>
.chart-container {
  height: 800px;
  width: 800px;
}
</style>
