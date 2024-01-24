<!-- Dados problemas con TS, se opto por JS -->
<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { opcionesDecimales, opcionesDisponibilidad } from '../utils/Constants';
import { response, responseTwo } from "../mock/DailyActivity";
import { externalTooltipPercentage, extraLegendSpacePlugin, htmlLegendPlugin, htmlLegendWhitSummationDoublePlugin } from '../utils/chartjs';

const colorLine = '#F8CD51';
const colorBar = '#49A5E6';
let myChart = null;

const typeDisponibilidad = ref(opcionesDisponibilidad.Disponibilidad);
const numberOfDecimals = ref(opcionesDecimales.Dos);
const changeValues = ref(false);

const exceedsTheGoal = ref(response.exceedsTheGoal);

const labels = [];
const values = {
  activities: [],
  errors: [],
};

response.values.forEach(row => {
  labels.push(row.day);
  values.activities.push(row.activities);
  values.errors.push(row.errors);
});

const data = {
  labels,
  datasets: [
    {
      label: `Actividad`,
      data: values.activities,
      backgroundColor: colorLine,
      borderColor: colorLine,
      pointStyle: false,
      yAxisID: 'y'
    },
    {
      label: `Errores`,
      data: values.errors,
      backgroundColor: colorBar,
      borderColor: colorBar,
      pointStyle: false,
      yAxisID: 'y1'
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
          containerID: 'legendContainerDA',
        },
        htmlLegendWhitSummationDouble: {
          exceedsTheGoal: exceedsTheGoal.value,
          containerID: 'legendContainerDA',
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
              return `${value} M`;
            }
          },
          title: {
            text: `% Ejecuciones`,
            display: true,
          },
          beginAtZero: true
        },
        y1: {
          grid: {
            lineWidth: 0
          },
          position: 'right',
          title: {
            display: true,
            text: 'N° Errores'
          },
          beginAtZero: true
        },
      },
    },
    plugins: [
      extraLegendSpacePlugin,
      htmlLegendPlugin,
      htmlLegendWhitSummationDoublePlugin,
    ],

  };

  const ctx = document.getElementById('dailyActivity');
  myChart = new Chart(ctx, config);
}

onMounted(() => {
  generateChart();
});

const updateChart = (chart, labels, newData) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = newData.activities;
  chart.data.datasets[1].data = newData.errors;
  chart.options.scales.y.ticks.callback = (value) => {
    return `${value} M`;
  }
  chart.options.scales.y1.ticks.callback = (value) => {
    return `${value}`;
  }
  chart.options.plugins.htmlLegendWhitSummationDouble.exceedsTheGoal = exceedsTheGoal.value;
  chart.update();
}

watch([typeDisponibilidad, numberOfDecimals], () => {
  changeValues.value = !changeValues.value;
  if (changeValues.value) {
    const labels = responseTwo.values.map(row => row.day);
    const values = {
      activities: responseTwo.values.map(row => row.activities),
      errors: responseTwo.values.map(row => row.errors),
    }
    exceedsTheGoal.value = responseTwo.exceedsTheGoal
    updateChart(myChart, labels, values);
  } else {
    exceedsTheGoal.value = response.exceedsTheGoal
    updateChart(myChart, labels, values);
  }
});
</script>

<template>
  <label for="typeDisponibilidadDA">Tipo de disponibilidad</label>
  <select v-model="typeDisponibilidad" id="typeDisponibilidadDA">
    <option v-for="option in opcionesDisponibilidad" :key="option">
      {{ option }}
    </option>
  </select>

  <label for="numberOfDecimalsDA">Número de decimales</label>
  <select v-model="numberOfDecimals" id="numberOfDecimalsDA">
    <option v-for="option in opcionesDecimales" :key="option">
      {{ option }}
    </option>
  </select>

  <div class="chart-container">
    <!-- Titulo -->
    <div class="chart-title"> Actividad mensual </div>
    <div id="legendContainerDA"></div>
    <canvas id="dailyActivity"> </canvas>
  </div>
</template>

<style scoped>
.chart-container {
  height: auto;
  width: 800px;
}

/* Title like chart */
.chart-title {
  font-size: .8rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
  color: rgb(102, 102, 102);
}
</style>
