<script setup lang="ts">
import { onMounted } from 'vue';
import { Chart, ChartConfiguration, ChartData, ChartItem } from 'chart.js/auto';

const data: ChartData = {
  labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
  datasets: [{
    backgroundColor: '#F8CD51',
    borderColor: '#F8CD51',
    borderWidth: 4,
    data: [0.109, 0.120, 0.130, 0.140, 0.120, 0.130, 0.140, 0.120, 0.130, 0.140, 0.120, 0.130],
    fill: false,
    label: 'Indisponibilidad Acumulada',
    pointRadius: 0,
  },
  {
    backgroundColor: '#49A5E6',
    barThickness: 10,
    borderColor: '#49A5E6',
    data: [0.181,0.270, 0.209, 0.238, 0.145, 0.181, 0.209, 0.181, 0.181, 0.145, 0.238, 0.181],
    label: 'Indisponibilidad Mensual',
    type: 'bar'
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
        text: 'Indisponibilidad Ponderada por Mes',
      },
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          lineWidth: 0
        },
        title: {
          text: 'Mes del año',
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
            return `${value} %`;
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
  const canvasTag = <ChartItem>document.getElementById('unavailabilityPerMonthChart');
  new Chart(
    canvasTag,
    config
  );

})
</script>

<template>
  <h5>Indisponibilidad Ponderada por Mes Chart</h5>
  <canvas id="unavailabilityPerMonthChart" class="chart"></canvas>
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
