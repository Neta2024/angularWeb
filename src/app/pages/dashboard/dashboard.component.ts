import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { RestApi } from 'src/app/shared/rest-api';

// interface remain {
//   "Vacation Leave Available": number;
//   "Sick Leave Available": number;
//   "Personal Leave Available": number;
// }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedYear: string = '2024';
  todayLeaves: { name: string, type: string, icon: string, period: string, colorClass: string }[] = [];
  remainingLeaves: { type: string, used: number, total: number, icon: string, colorClass: string }[] = [];

  constructor(private restApi: RestApi, private changeDetectorRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.getTodayLeaves();
    this.getRemainingLeaves();
  }

  onChange(selectedValue: string): void {
    this.selectedYear = selectedValue;
    this.getRemainingLeaves();
    console.log('selectedValue: ', selectedValue);
  }

  getTodayLeaves(): void {
    const yearRequest = { year: parseInt(this.selectedYear, 10) };
    this.restApi.get('dashboard/today-leave', yearRequest).subscribe((response: any) => {

      console.log('Today Leaves Response:', response);

      const fullName = response['fullName'];
      const leaveType = response['leaveType'];
      const period = response['period'];

      let colorClass = 'icon-color-default';
      if (leaveType === 'vacation') {
        colorClass = 'icon-color1';
      } else if (leaveType === 'Sick Leave') {
        colorClass = 'icon-color2';
      } else if (leaveType === 'Personal Leave') {
        colorClass = 'icon-color3';
      }

      this.todayLeaves = [
        { name: fullName, type: leaveType, icon: 'beach_access', period: period, colorClass: colorClass }
      ];

      console.log('this.todayLeaves:', this.todayLeaves);
    },
    // (error: any) => {
    //   console.error('Error fetching today leaves:', error);
    // }
  )
    // const mockLeaves = [
    //   { name: 'Will Smith', date: '2024-06-26', type: 'Vacation', icon: 'beach_access', period: 'both', colorClass: 'icon-color1'  },
    //   { name: 'Thor Odinson', date: '2024-06-26', type: 'Personal Leave', icon: 'person', period: 'day', colorClass: 'icon-color3' },
    //   { name: 'William Afton', date: '2024-06-26', type: 'Sick Leave', icon: 'medical_services', period: 'night', colorClass: 'icon-color2' },
    //   { name: 'Bruce Wayne', date: '2024-06-26', type: 'Personal Leave', icon: 'person', period: 'both', colorClass: 'icon-color3' }
    // ];

    // const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
    // this.todayLeaves = mockLeaves.filter(leave => leave.date === today);
  }

  getRemainingLeaves(): void {
    const yearRequest = { year: parseInt(this.selectedYear, 10) };
    this.restApi.post('dashboard/summary-leave', yearRequest).subscribe((response: any) => {
      
      const usedVacationLeave = response.used['Used Vacation leave'] || 0;
      const usedSickLeave = response.used['Used Sick leave'] || 0;
      const usedPersonalLeave = response.used['Used Personal leave'] || 0;

      const vacationLeaveAvailable = response.remain['Vacation Leave Available'] || 0;
      const sickLeaveAvailable = response.remain['Sick Leave Available'] || 0;
      const personalLeaveAvailable = response.remain['Personal Leave Available'] || 0;

      this.remainingLeaves = [
        { type: 'Vacation', used: usedVacationLeave, total: vacationLeaveAvailable, icon: 'beach_access', colorClass: 'icon-color1' },
        { type: 'Sick Leave', used: usedSickLeave, total: sickLeaveAvailable, icon: 'medical_services', colorClass: 'icon-color2' },
        { type: 'Personal Leave', used: usedPersonalLeave, total: personalLeaveAvailable, icon: 'person', colorClass: 'icon-color3' }
      ];

      this.changeDetectorRef.detectChanges();
    });
  }
}
