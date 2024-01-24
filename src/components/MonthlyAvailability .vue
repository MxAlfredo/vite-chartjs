<!-- Dados problemas con TS, se opto por JS -->
<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { opcionesDecimales, opcionesDisponibilidad } from '../utils/Constants';
import { response, responseTwo } from "../mock/MonthlyAvailability ";
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
  annualAverage: [],
  monthly: [],
};

response.values.forEach(row => {
  labels.push(row.month);
  values.annualAverage.push(row.annualAverage);
  values.monthly.push(row.monthly);
});

const calculateMonthlyAverage = (monthlyValues) => {
  const averages = Array(monthlyValues.length).fill(
    monthlyValues.reduce((acc, val) => acc + val, 0) / monthlyValues.length
  );
  return averages;
};

const data = {
  labels,
  datasets: [
    {
      label: `${typeDisponibilidad.value} acumulada`,
      data: values.annualAverage,
      backgroundColor: colorLine,
      borderColor: colorLine,
      pointStyle: false,
    },
    {
      label: `Indisponibilidad mensual`,
      data: values.monthly,
      backgroundColor: colorBar,
      borderColor: colorBar,
      pointStyle: false,
      type: 'bar',
      barThickness: 10,
    }
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
        title: {
          align: 'start',
          display: true,
          padding: {
            bottom: 10,
            top: 10
          },
          text: 'Indisponibilidad Ponderada por mes',
        },
        legend: {
          labels: {
            boxHeight: 10,
            boxPadding: 10,
            boxWidth: 10,
            padding: 20,
          },
          align: 'start',
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
            text: 'Mes del año',
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

  const ctx = document.getElementById('monthlyAvailability');
  myChart = new Chart(ctx, config);
}

onMounted(() => {
  generateChart();
});

const updateChart = (chart, labels, newData) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = newData.annualAverage;
  chart.data.datasets[1].data = newData.monthly;
  chart.data.datasets[0].label = `${typeDisponibilidad.value} acumulada`;
  chart.data.datasets[1].label = `Indisponibilidad mensual`;
  chart.options.plugins.title.text = `${typeDisponibilidad.value} ponderada por mes`;
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
    const labels = responseTwo.values.map(row => row.month);
    const values = {
      annualAverage: responseTwo.values.map(row => row.annualAverage),
      monthly: responseTwo.values.map(row => row.monthly),
    }
    updateChart(myChart, labels, values);
  } else {
    updateChart(myChart, labels, values);
  }
});
</script>

<template>
  <label for="typeDisponibilidadMA">Tipo de disponibilidad</label>
  <select v-model="typeDisponibilidad" id="typeDisponibilidadMA">
    <option v-for="option in opcionesDisponibilidad" :key="option">
      {{ option }}
    </option>
  </select>

  <label for="numberOfDecimalsMA">Número de decimales</label>
  <select v-model="numberOfDecimals" id="numberOfDecimalsMA">
    <option v-for="option in opcionesDecimales" :key="option">
      {{ option }}
    </option>
  </select>

  <div class="chart-container">
    <div id="legendContainerMA"></div>
    <canvas id="monthlyAvailability"> </canvas>
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
