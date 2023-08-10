import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '@api';
import { EscalaRecord } from '@/libs/data_types/data';
import dayjs from 'dayjs';
import time_svc from '@/libs/time_svc';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

// labels are hours of the day
const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const asdasd = Array.from({ length: 24 }, (_, i) => i);

export const DefaultData = {
  labels,
  datasets: [
    {
      label: 'Blue',
      backgroundColor: 'blue',
      data: [0.5, 0.1, 4],
    },
    {
      label: 'Red',
      backgroundColor: 'red',
      data: [4, 3, 5],
    },
    {
      label: 'Green',
      backgroundColor: 'green',
      data: [7, 2, 6],
    },
    {
      label: 'Dataset 1',
      data: [7, 2, 6],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

function createNumberArray(x: number, y: number): number[] {
  return Array.from({ length: y - x + 1 }, (_, index) => x + index);
}

function sortByDatetime(a: EscalaRecord, b: EscalaRecord) {
  const datetimeA = dayjs(a.timestamp);
  const datetimeB = dayjs(b.timestamp);
  return datetimeA.diff(datetimeB);
}
function arrangePayloadToBePrinted(escalas: EscalaRecord[]) {
  escalas.sort(sortByDatetime);

  // than, group by matricula
  const groupedMatricula: { [key: string]: EscalaRecord[] } = {};
  escalas.map((escala) => {
    const matricula = escala.matricula_colaborador;
    if (!groupedMatricula[matricula]) {
      groupedMatricula[matricula] = [escala];
    } else {
      groupedMatricula[matricula].push(escala);
    }
  });

  // than, transform 9->11, 14-20 to 9, 10, 11, 14, 15, 16, 17, 18, 19, 20[
  const groupedHours: { [key: string]: Set<number> } = {};
  for (const key in groupedMatricula) {
    const numEntries = groupedMatricula[key].length;
    groupedHours[key] = new Set();
    // i is always even, because if someone enters, he will leave.
    for (let i = 0; i < numEntries / 2; i++) {
      const entryHour = time_svc(groupedMatricula[key][i].timestamp).hour();
      const exitHour = time_svc(groupedMatricula[key][i + 1].timestamp).hour();
      createNumberArray(entryHour, exitHour).forEach((item) =>
        groupedHours[key].add(item),
      );
    }
  }
  return Object.values(groupedHours).map((hoursSet) => [...hoursSet]);
}

export default function HistoricoColaboadores() {
  const [day, setDay] = useState(dayjs('2023-05-30'));
  const [chartData, setChartData] = useState<any>({});

  const createData = (dataSets: number[][]) => {
    setChartData({
      labels,
      dataSets: dataSets.map((ds: number[]) => {
        return {
          label: labels,
          backgroundColor: 'blue',
          data: [],
        };
      }),
    });
  };

  useEffect(() => {
    const getData = async () => {
      const res = await api.escalas.getEscalaForADay(day.format('YYYY-MM-DD'));
      const hoursByColaborador = arrangePayloadToBePrinted(res.escalas);
      createData(hoursByColaborador);
    };
    getData();
  }, [day]);

  return (
    <>
      <Bar options={options} data={chartData} />{' '}
    </>
  );
}
