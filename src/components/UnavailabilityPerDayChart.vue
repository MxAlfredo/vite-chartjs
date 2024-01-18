<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Chart, ChartConfiguration, ChartData, ChartItem } from 'chart.js/auto';

const numberOfDecimals = ref(2);
// labels 1 o 30
const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
const data: ChartData = {
  labels,
  datasets: [{
    backgroundColor: '#F8CD51',
    borderColor: '#F8CD51',
    borderWidth: 4,
    data: [0.020, 0.026, 0.024, 0.022, 0.028, 0.030, 0.036, 0.034, 0.032, 0.038, 0.042, 0.038, 0.044, 0.046, 0.309, 0.046, 0.044, 0.046, 0.040, 0.038, 0.040, 0.038, 0.032, 0.046, 0.020, 0.026, 0.024, 0.028, 0.020, 0.018],
    fill: false,
    label: 'Indisponibilidad desponerada del día',
    pointRadius: 0,
  }
  ]
};

const config: ChartConfiguration = {
  data: data,
  options: {
    plugins: {
      legend: {
        align: 'center',
        labels: {
          boxHeight: 10,
          boxPadding: 10,
          boxWidth: 10,
          padding: 20
        }
      },
      title: {
        align: 'start',
        display: true,
        padding: {
          bottom: 10,
          top: 10
        },
        text: 'Indisponibilidad del día desponerado',
      },
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          lineWidth: 0
        },
        title: {
          text: 'N° día del mes',
          display: true
        },
      },
      y: {
        grid: {
          lineWidth: 0
        },
        max: 0.309,
        min: 0,
        ticks: {
          callback: (value) => {
            const decimals = parseFloat(value.toString()).toFixed(numberOfDecimals.value);
            return `${decimals} %`;
          }
        },
        title: {
          text: '% Indisp.',
          display: true,
        },
      },
    },
  },
  type: 'line'
};



onMounted(() => {
  const canvasTag = <ChartItem>document.getElementById('unavailabilityPerDayChart');
  new Chart(
    canvasTag,
    config
  );

})
</script>

<template>
  <h5>Indisponibilidad del día desponerado Chart</h5>
  <canvas id="unavailabilityPerDayChart" class="chart"></canvas>
</template>

<style scoped>
.yelow {
  color: #cbb122;
}

.chart {
  height: 800px;
  width: 800px;
}
</style>
