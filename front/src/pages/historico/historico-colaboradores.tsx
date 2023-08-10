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
import dayjs from 'dayjs';
import {
  convertPayloadToGraphData,
  readableIntervals,
} from '@/pages/historico/graph-helper';

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
      display: false,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    xAxis: {
      ticks: {
        maxTicksLimit: 24,
      },
    },
    x: {
      display: false,
    },
  },
};

export default function HistoricoColaboadores() {
  const [day, setDay] = useState(dayjs('2023-05-30'));
  const [chartData, setChartData] = useState<any>({});

  const createData = (hourlyData: number[]) => {
    const _data = {
      labels: readableIntervals,
      datasets: [
        {
          base: 0,
          label: 'Colaboradores',
          backgroundColor: 'red',
          data: hourlyData,
        },
      ],
    };
    console.log(_data);
    setChartData(_data);
  };

  useEffect(() => {
    const getData = async () => {
      const res = await api.escalas.getEscalaForADay(day.format('YYYY-MM-DD'));
      const intervalsOccupation = convertPayloadToGraphData(res.escalas);
      createData(intervalsOccupation);
    };
    getData();
  }, [day]);

  return (
    <>
      {Object.values(chartData).length !== 0 ? (
        <Bar options={options} data={chartData} />
      ) : null}
    </>
  );
}
