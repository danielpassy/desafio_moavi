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
const labels = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);

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
  const [things, setThings] = useState<any>('');
  const [day, setDay] = useState(dayjs('2023-05-30'));
  const [data, setData] = useState<any>({});

  const createData = (dataSets: number[][]) => {
    setData({
      labels,
      dataSets: dataSets.map((data: number[]) => {
        return {
          label: 'nothing',
          backgroundColor: 'blue',
          data: data,
        };
      }),
    });
  };

  useEffect(() => {
    api.escalas
      .getEscalaForASpecificDay(day.format('YYYY-MM-DD'))
      .then((res: { [key: string]: EscalaRecord[] }) => {
        const hoursByColaborador = arrangePayloadToBePrinted(res.escalas);
        createData(hoursByColaborador);
        setThings(hoursByColaborador);
      });
  }, [day]);

  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
}
