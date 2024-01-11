<script setup lang="ts">
import { onMounted } from 'vue';
import { Chart, ChartConfiguration, ChartData, ChartItem } from 'chart.js/auto';

const data: ChartData = {
  labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
  datasets: [{
    backgroundColor: '#F8CD51',
    borderColor: '#F8CD51',
    data: [40, 50, 60, 70, 90, 80, 60, 50, 40, 50, 60, 100],
    fill: false,
    label: 'Actividad',
    pointRadius: 0,
    yAxisID: 'y'
  },
  {
    backgroundColor: '#49A5E6',
    borderColor: '#49A5E6',
    data: [200, 180, 150, 300, 400, 300, 250, 200, 150, 200, 300, 400],
    fill: false,
    label: 'Errores',
    pointRadius: 0,
    yAxisID: 'y1'
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
        text: 'Actividad anual',
      },
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          lineWidth: 0
        },
        title: {
          display: true,
          text: 'Mes del año'
        }
      },
      y: {
        grid: {
          lineWidth: 0
        },
        max: 180,
        min: 0,
        ticks: {
          callback: (value) => {
            return `${value} M`;
          }
        },
        title: {
          display: true,
          text: '% Ejecuciones'
        }
      },
      y1: {
        grid: {
          lineWidth: 0
        },
        max: 1100,
        min: 0,
        position: 'right',
        title: {
          display: true,
          text: 'N° Errores'
        },
      },
    },
  },
  type: 'line'
};



onMounted(() => {
  const canvasTag = <ChartItem>document.getElementById('annualActivityChart');
  new Chart(
    canvasTag,
    config
  );

})
</script>

<template>
  <h5>Actividad Anual Chart</h5>
  <canvas id="annualActivityChart" class="chart"></canvas>
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
