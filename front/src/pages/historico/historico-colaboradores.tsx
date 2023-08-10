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
import { Box, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

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
          backgroundColor: 'gray',
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
    <Box
      sx={{
        m: 3,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" component="h4">
        Quantidade de colaboradores durante o dia
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          aria-label="previous day"
          onClick={() => setDay(day.add(-1, 'days'))}
        >
          <ChevronLeft />
        </IconButton>
        <DatePicker
          value={day}
          onChange={(newVal) => setDay(newVal ?? dayjs('2023-05-30'))}
        />
        <IconButton
          aria-label="next day"
          onClick={() => setDay(day.add(+1, 'days'))}
        >
          <ChevronRight />
        </IconButton>
      </Box>
      <Box sx={{ width: '70%' }}>
        {Object.values(chartData).length !== 0 ? (
          <Bar options={options} data={chartData} />
        ) : null}
      </Box>
    </Box>
  );
}
