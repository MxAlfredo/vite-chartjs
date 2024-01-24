<!-- Dados problemas con TS, se opto por JS -->
<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { opcionesDecimales, opcionesDisponibilidad } from '../utils/Constants';
import { response, responseTwo } from "../mock/WeightedDailyUnavailabilityAndCumulativeUnavailability";
import { externalTooltipPercentage, extraLegendSpacePlugin, htmlLegendPlugin, htmlLegendWhitSummationPlugin } from '../utils/chartjs';

const colorLine = '#F8CD51';
const colorBar = '#49A5E6';
let myChart = null;

const typeDisponibilidad = ref(opcionesDisponibilidad.Disponibilidad);
const numberOfDecimals = ref(opcionesDecimales.Dos);
const changeValues = ref(false);

const exceedsTheGoal = ref(response.exceedsTheGoal);

const labels = [];
const values = {
  acumulated: [],
  daily: [],
};

response.values.forEach(row => {
  labels.push(row.day);
  values.acumulated.push(row.value1);
  values.daily.push(row.value2);
});

const data = {
  labels,
  datasets: [
    {
      label: `${typeDisponibilidad.value} acumulada`,
      data: values.acumulated,
      backgroundColor: colorLine,
      borderColor: colorLine,
      pointStyle: false,
    },
    {
      label: `Contribución del día en el mes`,
      data: values.daily,
      backgroundColor: colorBar,
      borderColor: colorBar,
      pointStyle: false,
      type: 'bar',
      barThickness: 10,
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
        // title: {
        //   align: 'start',
        //   display: true,
        //   padding: {
        //     top: 10,
        //   },
        //   text: `${typeDisponibilidad.value} mensual`,
        // },
        htmlLegend: {
          containerID: 'legendContainerWDUACU',
        },
        htmlLegendWhitSummation: {
          exceedsTheGoal: exceedsTheGoal.value,
          containerID: 'legendContainerWDUACU',
          title: `${typeDisponibilidad.value} Acumulada Mensual `,
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
      htmlLegendWhitSummationPlugin,
    ],

  };

  const ctx = document.getElementById('weightedDailyUnavailabilityAndCumulativeUnavailability');
  myChart = new Chart(ctx, config);
}

onMounted(() => {
  generateChart();
});

const updateChart = (chart, labels, newData) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = newData.acumulated;
  chart.data.datasets[1].data = newData.daily;
  chart.data.datasets[0].label = `${typeDisponibilidad.value} acumulada`;
  chart.data.datasets[1].label = `Contribución del día en el mes`;
  chart.options.plugins.title.text = `${typeDisponibilidad.value} mensual`;
  chart.options.plugins.htmlLegendWhitSummation.title = `${typeDisponibilidad.value} Acumulada Mensual `
  chart.options.scales.y.ticks.callback = (value) => {
    const decimals = parseFloat(value.toString()).toFixed(numberOfDecimals.value);
    return `${decimals} %`;
  }
  chart.options.scales.y.title.text = `% ${typeDisponibilidad.value}.`;
  chart.options.plugins.htmlLegendWhitSummation.exceedsTheGoal = exceedsTheGoal.value;
  chart.update();
}

watch([typeDisponibilidad, numberOfDecimals], () => {
  changeValues.value = !changeValues.value;
  if (changeValues.value) {
    const labels = responseTwo.values.map(row => row.day);
    const values = {
      acumulated: responseTwo.values.map(row => row.value1),
      daily: responseTwo.values.map(row => row.value2),
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
  <label for="typeDisponibilidadWDUACU">Tipo de disponibilidad</label>
  <select v-model="typeDisponibilidad" id="typeDisponibilidadWDUACU">
    <option v-for="option in opcionesDisponibilidad" :key="option">
      {{ option }}
    </option>
  </select>

  <label for="numberOfDecimalsWDUACU">Número de decimales</label>
  <select v-model="numberOfDecimals" id="numberOfDecimalsWDUACU">
    <option v-for="option in opcionesDecimales" :key="option">
      {{ option }}
    </option>
  </select>

  <div class="chart-container">
    <!-- Titulo -->
    <div class="chart-title"> {{ typeDisponibilidad }} mensual </div>
    <div id="legendContainerWDUACU"></div>
    <canvas id="weightedDailyUnavailabilityAndCumulativeUnavailability"> </canvas>
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
