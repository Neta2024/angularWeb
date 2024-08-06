import { Component, Input, OnInit, ViewChild, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ApexOptions } from 'apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ChartComponent } from 'ng-apexcharts';
import { RestApi } from 'src/app/shared/rest-api';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

interface WorkingByMonth {
  month: number;
  totalWorkingDays: number;
  recordedTimeSheet: number;
  workedDays: number;
  allLeaves: number;
  holidays: number;
}


interface LeaveData {
  used: {
    "Used Vacation leave": number;
    "Used Sick leave": number;
    "Used Personal leave": number;
  };
  remain: {
    "Vacation Leave Available": number;
    "Sick Leave Available": number;
    "Personal Leave Available": number;
  };
  workingByMonth: WorkingByMonth[];
}

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() selectedYear: string = 'option1'; 
  workDays: number[] = [];
  leaveDays: number[] = [];
  pending: number[] = [];
  categories: string[] = [];

  constructor(private restApi: RestApi, private changeDetectorRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    // this.updateChartData(this.selectedYear);
    this.setChart();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear'] && changes['selectedYear'].currentValue) {
      this.updateChartData(changes['selectedYear'].currentValue);
    }
  }

  updateChartData(selectedYear: string): void {
    this.categories = [];
    this.workDays = [];
    this.leaveDays = [];
    this.pending = [];
    this.selectedYear = selectedYear;
    const yearRequest = { year: parseInt(selectedYear, 10) };
    console.log('yearRequest: ', yearRequest);

    // float workDays = 0.0;
    // float leaveDays;
    // float pending;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    this.restApi.post('dashboard/summary-leave', yearRequest).subscribe((response: any) => {
      console.log(response);

      response.workingByMonth.forEach((monthData: WorkingByMonth) => {
        // this.workDays = monthData.totalWorkingDays - monthData.allLeaves - monthData.recordedTimeSheet;
        this.categories.push(monthNames[monthData.month - 1]);
        this.pending.push(monthData.totalWorkingDays - monthData.recordedTimeSheet);
        this.leaveDays.push(monthData.allLeaves);
        this.workDays.push(monthData.totalWorkingDays - (monthData.allLeaves + (monthData.totalWorkingDays - monthData.recordedTimeSheet)));
      });
      //this.setChart();
      // { name: "Work Days", data: this.workDays },
      // { name: "Leaves", data: this.leaveDays },
      // { name: "Pending", data: this.pending }
      this.chartOptions.series.push({name: "Work Days", type: "bar", data: this.workDays});
      this.changeDetectorRef.detectChanges();
    }, error => {
      console.error('API call error:', error);
      // Handle error appropriately here
    });



    // const dataFor2024 = {
    //   "Work Days": [15, 14, 16, 18, 0,0,0,0,0,0,0,0],
    //   "Leave Days": [1, 0, 0, 1, 1,0,0,0,0,0,0,0],
    //   "Pending": [21,19,21,19,21,19,0,0,0,0,0,0], // this has to be subtracted by days checked in
    //   categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // };
    // const dataFor2023 = {
    //   "Work Days": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
    //   "Leave Days": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
    //   "Pending": [20,19,21,16,20,21,20,20,21,20,22,18],
    //   categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // };
    // const dataFor2022 = {
    //   "Work Days": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
    //   "Leave Days": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
    //   "Pending": [20,19,23,17,18,21,16,22,22,18,22,19],
    //   categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // };
    // const dataFor2021 = {
    //   "Work Days": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
    //   "Leave Days": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
    //   "Pending": [20,19,23,18,18,21,20,21,22,19,22,20],
    //   categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // };
    // const dataFor2020 = {
    //   "Work Days": [14, 15, 13, 14, 12, 16,14, 15, 13, 14, 12, 16],
    //   "Leave Days": [0, 0, 1, 0, 0, 0,0, 0, 1, 0, 0, 0],
    //   "Pending": [22,19,22,21,18,21,19,20,20,20,19,20],
    //   categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // };

    // switch(selectedYear) {
    //   case 'option1':
    //     this.chartOptions.series = [
    //       { name: "Work Days", data: dataFor2024["Work Days"] },
    //       { name: "Leave Days", data: dataFor2024["Leave Days"] },
    //       { name: "Pending", data: this.subtractDays(dataFor2024["Pending"], dataFor2024["Work Days"], dataFor2024["Leave Days"]) }
    //     ];
    //     this.chartOptions.xaxis = { categories: dataFor2024.categories };
    //     break;
    //   case 'option2':
    //     this.chartOptions.series = [
    //       { name: "Work Days", data: dataFor2023["Work Days"] },
    //       { name: "Leave Days", data: dataFor2023["Leave Days"] },
    //       { name: "Pending", data: this.subtractDays(dataFor2023["Pending"], dataFor2023["Work Days"], dataFor2023["Leave Days"]) }
    //     ];
    //     this.chartOptions.xaxis = { categories: dataFor2023.categories };
    //     break;
    //   case 'option3':
    //     this.chartOptions.series = [
    //       { name: "Work Days", data: dataFor2022["Work Days"] },
    //       { name: "Leave Days", data: dataFor2022["Leave Days"] },
    //       { name: "Pending", data: this.subtractDays(dataFor2022["Pending"], dataFor2022["Work Days"], dataFor2022["Leave Days"]) }
    //     ];
    //     this.chartOptions.xaxis = { categories: dataFor2022.categories };
    //     break;
    //   case 'option4':
    //     this.chartOptions.series = [
    //       { name: "Work Days", data: dataFor2021["Work Days"] },
    //       { name: "Leave Days", data: dataFor2021["Leave Days"] },
    //       { name: "Pending", data: this.subtractDays(dataFor2021["Pending"], dataFor2021["Work Days"], dataFor2021["Leave Days"]) }
    //     ];
    //     this.chartOptions.xaxis = { categories: dataFor2021.categories };
    //     break;
    //   case 'option5':
    //     this.chartOptions.series = [
    //       { name: "Work Days", data: dataFor2020["Work Days"] },
    //       { name: "Leave Days", data: dataFor2020["Leave Days"] },
    //       { name: "Pending", data: this.subtractDays(dataFor2020["Pending"], dataFor2020["Work Days"], dataFor2020["Leave Days"]) }
    //     ];
    //     this.chartOptions.xaxis = { categories: dataFor2020.categories };
    //     break;
    // }
  }

  setChart(){
    this.chartOptions = {
      series: [],
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
        categories: this.categories
      },
      legend: {
        position: "right",
        offsetY: 40,
        markers: {
          fillColors: ['#62CFFC', '#FFB489', '#DFDFDF']
      },
      },
      fill: {
        opacity: 1,
        colors: ['#62CFFC', '#FFB489', '#DFDFDF']
      },
      tooltip: {
        shared: true
      }
    };
    //console.log(this.categories);

    // if (this.chart && this.chart.updateOptions) {
    //   this.chart.updateOptions(this.chartOptions);
    // } else {
    //   console.error('Chart or updateOptions method not available.');
    // }
  }

  calculatePendingDays(monthData: any): number {
    return monthData.totalWorkingDays - monthData.recordedTimeSheet - monthData.allLeaves - monthData.holidays;
  }

  subtractDays(workingDays: number[], daysAttended: number[], daysLeft: number[]): number[] {
    const remainingDays: number[] = [];
    for (let i = 0; i < workingDays.length; i++) {
      remainingDays.push(workingDays[i] - daysAttended[i] - daysLeft[i]);
    }
    return remainingDays;
  }
}
