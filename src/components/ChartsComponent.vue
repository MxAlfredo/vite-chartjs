<script setup lang="ts">
import { Chart, ChartConfiguration, ChartData, ChartItem } from 'chart.js/auto';
import { onMounted } from 'vue';

// Labels 1 to 30
const labels = Array.from({ length: 30 }, (_, i) => i + 1);
const values = Array.from({ length: 30 }, () => Math.random() * (0.39 - 0.015) + 0.015);


const data:ChartData = {
  labels,
  datasets: [{
    label: 'Indisponibilidad desponderada del día',
    data: values,
    fill: false,
    borderColor: '#cbb122',
    tension: 0.1,
    backgroundColor: '#cbb122',
    pointRadius: 0,
    
  }]
};

const config: ChartConfiguration = {
  type: 'line',
  data: data,
  options: {
    scales: {
      y: {
        title: {
          text: '% Indisp',
          display: true,
        }
      },
      x: {
        title: {
          text: 'N° dia del mes',
          display: true
        }
      }
    },
  }
};



onMounted(() => {
  const canvasTag = <ChartItem>document.getElementById('myChart');
  new Chart(
    canvasTag,
    config
  );

})
</script>

<template>
  <h1>Hello</h1>

  <canvas id="myChart"></canvas>
</template>

<style scoped>
#myChart {
  height: 800px;
  width: 800px;
}
</style>
