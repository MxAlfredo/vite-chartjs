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
  };

  const ctx = document.getElementById('weightedDailyUnavailability');
  myChart = new Chart(ctx, config);
}

let legendItems = ref([]);

const updateLegendItems = () => {
  legendItems.value = myChart.options.plugins.legend.labels.generateLabels(myChart);
}

onMounted(() => {
  generateChart();
  updateLegendItems();
});

const updateLegendItem = (item) => {
  myChart.setDatasetVisibility(item.datasetIndex, !myChart.isDatasetVisible(item.datasetIndex));
  myChart.update();
  updateLegendItems();
}

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
    <div class="chart-title">{{ typeDisponibilidad }} del día desponerado</div>
    <div class="chart-legend">
      <ul class="legend-items">
        <li
          class="legend-item"
          v-for="legendItem in legendItems"
          :key="legendItem"
          @click="updateLegendItem(legendItem)"
        >
          <span
            class="legend-color"
            :style="{ backgroundColor: legendItem.fillStyle }"
          ></span>
          <p
            class="legend-label"
            :style="{
              textDecoration: legendItem.hidden ? 'line-through' : 'none',
            }"
          >
            {{ legendItem.text }}
          </p>
        </li>
      </ul>
      <div class="legend-total">
        <div class="legend-total-item">Total</div>
      </div>
    </div>
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
  font-size: 0.8rem;
  text-align: left;
  margin-bottom: 10px;
}

.chart-legend {
  font-size: 0.7rem;
  text-align: left;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.legend-items {
  margin: 0px;
  padding: 0px;
  display: flex;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.legend-label {
  font-size: 0.6rem;
}
.legend-total {
  display: flex;
  gap: 10px;
}
.legend-total-item {
  font-size: 0.6rem;
  font-weight: bolder;
}

</style>
