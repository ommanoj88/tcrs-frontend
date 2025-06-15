import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Line Chart Component
export const TrendLineChart: React.FC<{
  data: any[];
  title: string;
  dataKey: string;
  color: string;
}> = ({ data, title, dataKey, color }) => {
  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: title,
        data: data.map(item => item[dataKey]),
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Doughnut Chart Component
export const DistributionDoughnutChart: React.FC<{
  data: Record<string, number>;
  title: string;
  colors: string[];
}> = ({ data, title, colors }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

// Bar Chart Component
export const VerticalBarChart: React.FC<{
  data: any[];
  title: string;
  dataKey: string;
  labelKey: string;
  color: string;
}> = ({ data, title, dataKey, labelKey, color }) => {
  const chartData = {
    labels: data.map(item => item[labelKey]),
    datasets: [
      {
        label: title,
        data: data.map(item => item[dataKey]),
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// Horizontal Bar Chart Component
export const HorizontalBarChart: React.FC<{
  data: any[];
  title: string;
  dataKey: string;
  labelKey: string;
  color: string;
}> = ({ data, title, dataKey, labelKey, color }) => {
  const chartData = {
    labels: data.map(item => item[labelKey]),
    datasets: [
      {
        label: title,
        data: data.map(item => item[dataKey]),
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};