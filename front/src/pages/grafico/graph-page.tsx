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
import {
  convertPayloadToGraphData,
  readableIntervals,
} from '@/pages/grafico/graph-helper';
import { Box, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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
      display: false,
    },
    title: {
      display: false,
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

export default function GraphPage() {
  const [day, setDay] = useState(time_svc('2023-05-30'));
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
      const res = await api.escalas.getEscalas(
        day.format('YYYY-MM-DD'),
        day.add(1, 'days').format('YYYY-MM-DD'),
      );
      const intervalsOccupation = convertPayloadToGraphData(res.escalas);
      createData(intervalsOccupation);
    };
    getData();
  }, [day]);

  return (
    <>
      <Typography variant="h4" component="h4" sx={{ mb: 3 }}>
        Quantidade de colaboradores durante o dia
      </Typography>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <IconButton
            aria-label="previous day"
            onClick={() => setDay(day.add(-1, 'days'))}
          >
            <ChevronLeft />
          </IconButton>
          <DatePicker
            label="Dia"
            format="DD/MM/YYYY"
            value={day}
            onChange={(newVal) => setDay(newVal ?? time_svc('2023-05-30'))}
          />
          <IconButton
            aria-label="next day"
            onClick={() => setDay(day.add(+1, 'days'))}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        {Object.values(chartData).length !== 0 ? (
          <Bar options={options} data={chartData} />
        ) : null}
      </Box>
    </>
  );
}
