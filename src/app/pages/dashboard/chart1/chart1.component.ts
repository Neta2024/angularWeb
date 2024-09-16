import { Component, Input, OnInit, ViewChild, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
    console.log('ngOnInit called');
    // this.updateChartData(this.selectedYear);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear'] && changes['selectedYear'].currentValue) {
      this.updateChartData(changes['selectedYear'].currentValue);
    }
  }

  updateChartData(selectedYear: string): void {
    console.log('updateChartData called with year:', selectedYear);

    // Reset chartOptions to force chart refresh
    this.chartOptions = null;
    this.categories = [];
    this.workDays = [];
    this.leaveDays = [];
    this.pending = [];
    this.selectedYear = selectedYear;
    const yearRequest = { year: parseInt(selectedYear, 10) };
    console.log('yearRequest: ', yearRequest);


    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    this.restApi.post('dashboard/summary-leave', yearRequest).subscribe((response: any) => {
      console.log(response);

      
      response.workingByMonth.forEach((monthData: WorkingByMonth) => {
        this.categories.push(monthNames[monthData.month - 1]);

        const pendingData = monthData.totalWorkingDays - monthData.recordedTimeSheet;
        const leaveDayData = monthData.allLeaves;
        const workDaysData = monthData.totalWorkingDays - leaveDayData - pendingData;

        this.pending.push(pendingData);
        this.leaveDays.push(leaveDayData);
        this.workDays.push(workDaysData);


          // Check if data exists for this month, otherwise push 0
      const totalWorkingDays = monthData.totalWorkingDays == 0 || 0; // Fallback to 0 if totalWorkingDays is empty
      const recordedTimeSheet = monthData.recordedTimeSheet == 0 || 0; // Fallback to 0 if recordedTimeSheet is empty
      const allLeaves = monthData.allLeaves == 0 || 0; 

        console.log('Month', monthNames[monthData.month - 1] , 'workDays ', workDaysData, 'leaves', leaveDayData, 'pending', pendingData)
      });

      this.setChart();
      this.changeDetectorRef.detectChanges();
    }, error => {
      console.error('API call error:', error);
      // Handle error appropriately here
    });

  }

  setChart(){
    console.log('setChart called');
    this.chartOptions = {
      series: [
        { name: "Work Days", data: this.workDays || []},
        { name: "Leaves", data: this.leaveDays || []},
        { name: "Pending", data: this.pending || []}
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
    this.changeDetectorRef.detectChanges();
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
