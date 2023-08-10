import { EscalaRecord } from '@/libs/data_types/data';
import time_svc from '@/libs/time_svc';

// Um "Interval" é um interalo de 10 minutos.
// Unidade básica desse gráfico
// ele é repsentado por um inteiro.
// Ou seja, 10 min -> 1.
// e.g, 10:20 da manhã -> 102
// 10:30 da manhã -> 103

export const intervalsInADay = (() => {
  const intervals = [];

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 6; j++) {
      intervals.push(i * 10 + j * 1);
    }
  }
  return intervals;
})();

export const readableIntervals = intervalsInADay.map((interval) => {
  const decimal = Math.floor(interval / 10);
  const unit = interval % 10;
  return `${decimal}:${unit}0`;
});

export const getIntervalsBeetween = (smaller: number, bigger: number) => {
  const intervals = [];
  let intervalToAdd;
  const decimalStart = Math.floor(smaller / 10);

  for (let decimal = decimalStart; ; decimal++) {
    for (let unit = 0; unit < 6; unit++) {
      intervalToAdd = decimal * 10 + unit * 1;
      if (intervalToAdd < smaller) {
        continue;
      }
      if (intervalToAdd > bigger) {
        return intervals;
      }
      intervals.push(decimal * 10 + unit * 1);
    }
  }
};

export const timestampToInterval = (timestamp: string) => {
  return (
    time_svc(timestamp).hour() * 10 + Math.floor(time_svc(timestamp).minute())
  );
};

export function sortByDatetime(a: EscalaRecord, b: EscalaRecord) {
  const datetimeA = time_svc(a.timestamp);
  const datetimeB = time_svc(b.timestamp);
  return datetimeA.diff(datetimeB);
}

export function convertPayloadToGraphData(escalas: EscalaRecord[]) {
  escalas.sort(sortByDatetime);

  const groupedMatricula: { [key: string]: EscalaRecord[] } = {};
  escalas.forEach((escala) => {
    const matricula = escala.matricula_colaborador;
    if (!groupedMatricula[matricula]) {
      groupedMatricula[matricula] = [escala];
    } else {
      groupedMatricula[matricula].push(escala);
    }
  });

  // create an object to hold number of colabodores presentes per 10min
  const ColaboratorsPerInterval: { [key: string]: number } = {};
  intervalsInADay.map((interval: number) => {
    ColaboratorsPerInterval[interval] = 0;
  });

  for (const matricula in groupedMatricula) {
    const numEscalas = groupedMatricula[matricula].length;

    // get each pair of colaborator enters colaborator leaves
    for (let i = 0; i < numEscalas / 2; i++) {
      const intervalEntered = timestampToInterval(
        groupedMatricula[matricula][i].timestamp,
      );
      const intervalLeft = timestampToInterval(
        groupedMatricula[matricula][i + 1].timestamp,
      );
      getIntervalsBeetween(intervalEntered, intervalLeft).forEach(
        (item) => ColaboratorsPerInterval[item]++,
      );
    }
  }
  return Object.values(ColaboratorsPerInterval);
}
