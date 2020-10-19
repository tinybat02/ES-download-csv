import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame, DataMapping } from 'types';
import Dropdown from 'react-dropdown';
import { processData, csvProcess } from './util/helpFunc';
import CsvIcon from './img/CSV.svg';
import useCsvDownloader from 'use-csv-downloader';
import 'react-dropdown/style.css';

type optionType = 'sum_day' | 'avg_day' | 'sum_hour' | 'avg_hour' | '' | 'all';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  sum_day: DataMapping;
  avg_day: DataMapping;
  sum_hour: DataMapping;
  avg_hour: DataMapping;
  option: optionType;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    sum_day: { value: [], time: [] },
    avg_day: { value: [], time: [] },
    sum_hour: { value: [], time: [] },
    avg_hour: { value: [], time: [] },
    option: '',
  };
  componentDidMount() {
    // console.log('___________yay____________', this.props.data);
    if (this.props.data.series.length > 0 && this.props.data.series.length == 4) {
      const series = this.props.data.series as Array<Frame>;
      const data = processData(series);
      this.setState({ ...data });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      if (this.props.data.series.length > 0 && this.props.data.series.length == 4) {
        const series = this.props.data.series as Array<Frame>;
        const data = processData(series);
        this.setState({ ...data });
      }
    }
  }

  onOptionSelect = (opt: { label: React.ReactNode; value: optionType }) => this.setState({ option: opt.value });

  handleDownload = () => {
    const { option } = this.state;
    if (option == '') return;

    if (option == 'sum_day' || option == 'avg_day') {
      const { time, value } = this.state[option];
      const res = csvProcess(time, value, true);
      const downloadCsv = useCsvDownloader({ quote: '', delimiter: ';' });
      downloadCsv(res, `${option}.csv`);
    }

    if (option == 'sum_hour' || option == 'avg_hour') {
      const { time, value } = this.state[option];
      const res = csvProcess(time, value);
      const downloadCsv = useCsvDownloader({ quote: '', delimiter: ';' });
      downloadCsv(res, `${option}.csv`);
    }

    if (option == 'all') {
      const downloadCsv = useCsvDownloader({ quote: '', delimiter: ';' });
      const { sum_day, avg_day, sum_hour, avg_hour } = this.state;
      downloadCsv(csvProcess(sum_day.time, sum_day.value), 'sum_day.csv');
      downloadCsv(csvProcess(avg_day.time, avg_day.value), 'avg_day.csv');
      downloadCsv(csvProcess(sum_hour.time, sum_hour.value), 'sum_hour.csv');
      downloadCsv(csvProcess(avg_hour.time, avg_hour.value), 'avg_hour.csv');
    }
  };

  render() {
    const { width, height } = this.props;
    const { option } = this.state;

    return (
      <div
        style={{
          width,
          height,
          padding: 10,
        }}
      >
        <Dropdown
          options={[
            { value: 'sum_day', label: 'Daily Customers' },
            { value: 'avg_day', label: 'Daily Average Duration' },
            { value: 'sum_hour', label: 'Hourly Customers of Arrival' },
            { value: 'avg_hour', label: 'Hourly Average Duration from Arrival' },
            { value: 'all', label: 'All Files' },
          ]}
          //@ts-ignore
          onChange={this.onOptionSelect}
          placeholder="Choose File to Download"
        />
        <div style={{ width: '100%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {option != '' && (
            <img src={CsvIcon} style={{ height: '50%', cursor: 'pointer' }} onClick={this.handleDownload} />
          )}
        </div>
      </div>
    );
  }
}
