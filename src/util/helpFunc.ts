import { Frame, DataMapping } from '../types';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { CSVRow } from '../types';
dayjs.extend(utc);
dayjs.extend(timezone);

const template: DataMapping = { value: [], time: [] };

export const processData = (data: Array<Frame>) => {
  let sum_day = { ...template },
    avg_day = { ...template },
    sum_hour = { ...template },
    avg_hour = { ...template };

  data.map(category => {
    if (category.name == 'sum_day') {
      sum_day.value = category.fields[0].values.buffer;
      sum_day.time = category.fields[1].values.buffer;
    }

    if (category.name == 'avg_day') {
      avg_day.value = category.fields[0].values.buffer;
      avg_day.time = category.fields[1].values.buffer;
    }

    if (category.name == 'sum_hour') {
      sum_hour.value = category.fields[0].values.buffer;
      sum_hour.time = category.fields[1].values.buffer;
    }

    if (category.name == 'avg_hour') {
      avg_hour.value = category.fields[0].values.buffer;
      avg_hour.time = category.fields[1].values.buffer;
    }
  });

  return { sum_day, avg_day, sum_hour, avg_hour };
};

export const csvProcess = (timeArr: number[], valueArr: number[], daily = false): CSVRow[] => {
  const result: CSVRow[] = [];
  if (daily) {
    timeArr.map((time, idx) => {
      const dayobj = dayjs.unix(time / 1000).tz('Europe/Berlin');
      result.push({
        Timestamp: dayobj.format('YYYY-MM-DD'),
        Value: Math.round(valueArr[idx] * 100) / 100,
      });
    });
  } else {
    timeArr.map((time, idx) => {
      const dayobj = dayjs.unix(time / 1000).tz('Europe/Berlin');
      result.push({
        Timestamp: dayobj.format('YYYY-MM-DD HH:00'),
        Value: Math.round(valueArr[idx] * 100) / 100,
      });
    });
  }

  return result;
};
