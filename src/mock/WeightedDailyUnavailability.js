// Opciones indisponibilidad / disponibilidad
const opcionesDisponibilidad = Object.freeze({
  Disponibilidad: "Disponibilidad",
  Indisponibilidad: "Indisponibilidad",
});

const opcionesDecimales = Object.freeze({
  Dos: 2,
  Tres: 3,
});

const response = {
  name: "weightedDailyUnavailability",
  values: [
    { day: "01", value: 0.02 },
    { day: "02", value: 0.026 },
    { day: "03", value: 0.024 },
    { day: "04", value: 0.022 },
    { day: "05", value: 0.028 },
    { day: "06", value: 0.03 },
    { day: "07", value: 0.036 },
    { day: "08", value: 0.034 },
    { day: "09", value: 0.032 },
    { day: "10", value: 0.038 },
    { day: "11", value: 0.042 },
    { day: "12", value: 0.038 },
    { day: "13", value: 0.044 },
    { day: "14", value: 0.046 },
    { day: "15", value: 0.309 },
    { day: "16", value: 0.046 },
    { day: "17", value: 0.044 },
    { day: "18", value: 0.046 },
    { day: "19", value: 0.04 },
    { day: "20", value: 0.038 },
    { day: "21", value: 0.04 },
    { day: "22", value: 0.038 },
    { day: "23", value: 0.032 },
    { day: "24", value: 0.046 },
    { day: "25", value: 0.02 },
    { day: "26", value: 0.026 },
    { day: "27", value: 0.024 },
    { day: "28", value: 0.028 },
    { day: "29", value: 0.02 },
    { day: "30", value: 0.018 },
  ],
};

const responseTwo = {
  name: "weightedDailyUnavailability",
  values: [
    { day: "01", value: 0.02 },
    { day: "02", value: 0.026 },
    { day: "03", value: 0.024 },
    { day: "04", value: 0.022 },
    { day: "05", value: 0.028 },
    { day: "06", value: 0.03 },
    { day: "07", value: 0.036 },
    { day: "08", value: 0.034 },
    { day: "09", value: 0.032 },
    { day: "10", value: 0.038 },
    { day: "11", value: 0.042 },
    { day: "12", value: 0.038 },
    { day: "13", value: 0.044 },
    { day: "14", value: 0.046 },
    { day: "15", value: 0.309 },
    { day: "16", value: 0.046 },
    { day: "17", value: 0.044 },
  ],
};

export { opcionesDisponibilidad, opcionesDecimales, response, responseTwo };
