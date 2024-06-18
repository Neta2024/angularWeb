import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApexOptions } from 'apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ChartComponent } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public selectedYear: string = "notselected"; 

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Days Attended",
          data: null
        },
        {
          name: "Leaves",
          data: null
        },
        {
          name: "Working Days",
          data: null
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: ["01/2024", "02/2024", "03/2024", "04/2024", "05/2024", "06/2024", "07/2024", "08/2024", "09/2024", "10/2024", "11/2024", "12/2024"]
      },
      legend: {
        position: "right",
        offsetY: 40,
        markers: {
          fillColors: ['#00E396', '#FEB019', '#808080']
      },
      },
      fill: {
        opacity: 1,
        colors: ['#00E396', '#FEB019', '#808080']
      },
    };
  }

  updateChartData(selectedYear: any): void {
    this.selectedYear = selectedYear;

    const dataFor2024 = {
      "Days Attended": [15, 14, 16, 18, 0,0,0,0,0,0,0,0],
      "Leaves": [1, 0, 0, 1, 1,0,0,0,0,0,0,0],
      "Working Days": [21,19,21,19,21,19,0,0,0,0,0,0], // this has to be subtracted by days checked in
      categories: ["01/2024", "02/2024", "03/2024", "04/2024", "05/2024", "06/2024", "07/2024", "08/2024", "09/2024", "10/2024", "11/2024", "12/2024"]
    };
    const dataFor2023 = {
      "Days Attended": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
      "Leaves": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
      "Working Days": [20,19,21,16,20,21,20,20,21,20,22,18],
      categories: ["01/2023", "02/2023", "03/2023", "04/2023", "05/2023", "06/2023", "07/2023", "08/2023", "09/2023", "10/2023", "11/2023", "12/2023"]
    };
    const dataFor2022 = {
      "Days Attended": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
      "Leaves": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
      "Working Days": [20,19,23,17,18,21,16,22,22,18,22,19],
      categories: ["01/2022", "02/2022", "03/2022", "04/2022", "05/2022", "06/2022", "07/2022", "08/2022", "09/2022", "10/2022", "11/2022", "12/2022"]
    };
    const dataFor2021 = {
      "Days Attended": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
      "Leaves": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
      "Working Days": [20,19,23,18,18,21,20,21,22,19,22,20],
      categories: ["01/2021", "02/2021", "03/2021", "04/2021", "05/2021", "06/2021", "07/2021", "08/2021", "09/2021", "10/2021", "11/2021", "12/2021"]
    };
    const dataFor2020 = {
      "Days Attended": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
      "Leaves": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
      "Working Days": [22,19,22,21,18,21,19,20,20,20,19,20],
      categories: ["01/2020", "02/2020", "03/2020", "04/2020", "05/2020", "06/2020", "07/2020", "08/2020", "09/2020", "10/2020", "11/2020", "12/2020"]
    };

    switch(selectedYear) {
      case 'option1':
        this.chartOptions.series = [
          { name: "Days Attended", data: dataFor2024["Days Attended"] },
          { name: "Leaves", data: dataFor2024["Leaves"] },
          { name: "Working Days", data: this.subtractDays(dataFor2024["Working Days"], dataFor2024["Days Attended"], dataFor2024["Leaves"]) }
        ];
        this.chartOptions.xaxis = { categories: dataFor2024.categories };
        break;
      case 'option2':
        this.chartOptions.series = [
          { name: "Days Attended", data: dataFor2023["Days Attended"] },
          { name: "Leaves", data: dataFor2023["Leaves"] },
          { name: "Working Days", data: this.subtractDays(dataFor2023["Working Days"], dataFor2023["Days Attended"], dataFor2023["Leaves"]) }
        ];
        this.chartOptions.xaxis = { categories: dataFor2023.categories };
        break;
      case 'option3':
        this.chartOptions.series = [
          { name: "Days Attended", data: dataFor2022["Days Attended"] },
          { name: "Leaves", data: dataFor2022["Leaves"] },
          { name: "Working Days", data: this.subtractDays(dataFor2022["Working Days"], dataFor2022["Days Attended"], dataFor2022["Leaves"]) }
        ];
        this.chartOptions.xaxis = { categories: dataFor2022.categories };
        break;
      case 'option4':
        this.chartOptions.series = [
          { name: "Days Attended", data: dataFor2021["Days Attended"] },
          { name: "Leaves", data: dataFor2021["Leaves"] },
          { name: "Working Days", data: this.subtractDays(dataFor2021["Working Days"], dataFor2021["Days Attended"], dataFor2021["Leaves"]) }
        ];
        this.chartOptions.xaxis = { categories: dataFor2021.categories };
        break;
      case 'option5':
        this.chartOptions.series = [
          { name: "Days Attended", data: dataFor2020["Days Attended"] },
          { name: "Leaves", data: dataFor2020["Leaves"] },
          { name: "Working Days", data: this.subtractDays(dataFor2020["Working Days"], dataFor2020["Days Attended"], dataFor2020["Leaves"]) }
        ];
        this.chartOptions.xaxis = { categories: dataFor2020.categories };
        break;
    }
  }

  subtractDays(workingDays: number[], daysAttended: number[], daysLeft: number[]): number[] {
    const remainingDays: number[] = [];
    for (let i = 0; i < workingDays.length; i++) {
      remainingDays.push(workingDays[i] - daysAttended[i] - daysLeft[i]);
    }
    return remainingDays;
  }

  ngOnInit() {
  }

}

