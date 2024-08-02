interface Leave {
  LeaveType: string;
  Period: string;
}

interface TodayLeave {
  name: string;
  type: string;
  icon: string;
  period: string;
  colorClass: string;
}

interface GroupedLeaves {
  [key: string]: any[];
}

import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  group: { value: { period: string, colorClass: string, icon: string }[] }[] = [];

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

  // getTodayLeaves(): void {
  //   const yearRequest = { year: parseInt(this.selectedYear, 10) };
  //   this.restApi.get('dashboard/today-leave', yearRequest).subscribe((response: any) => {
  //     console.log(response);
  //     this.todayLeaves = response.map((todayLeave: any) => ({
  //       name: todayLeave['fullName'],
  //       type: this.getLeaveTypeText(todayLeave['leaveType']),
  //       icon: this.getLeaveIcon(todayLeave['leaveType']),
  //       period: todayLeave['period'],
  //       colorClass: this.getLeaveColorClass(todayLeave['leaveType'])
  //     }));
  //     console.log('this.todayLeaves:', this.todayLeaves);
  //   });
  // }

  // getLeaveTypeText(leaveType: string): string {
  //   switch (leaveType) {
  //     case 'vacation':
  //       return 'Vacation';
  //     case 'sick':
  //       return 'Sick Leave';
  //     case 'personal':
  //       return 'Personal Leave';
  //     case 'Other':
  //       return 'Other Leave';
  //     default:
  //       return '';
  //   }
  // }

  // getLeaveIcon(leaveType: string): string {
  //   switch (leaveType) {
  //     case 'vacation':
  //       return 'beach_access';
  //     case 'sick':
  //       return 'medical_services';
  //     case 'personal':
  //       return 'person';
  //     case 'Other':
  //       return 'event-busy';
  //     default:
  //       return '';
  //   }
  // }

  // getLeaveColorClass(leaveType: string): string {
  //   switch (leaveType) {
  //     case 'vacation':
  //       return 'icon-color1';
  //     case 'sick':
  //       return 'icon-color2';
  //     case 'personal':
  //       return 'icon-color3';
  //     case 'Other':
  //       return 'icon-color4';
  //     default:
  //       return 'icon-color-default';
  //   }
  // }

  getTodayLeaves(): void {
    const yearRequest = { year: parseInt(this.selectedYear, 10) };
    this.restApi.get('dashboard/today-leave', yearRequest).subscribe((response: any) => {

      console.log(response);

      this.todayLeaves = [];

      // response.forEach((todayLeave: any) => {
      // const fullName = todayLeave['fullName'];
      // const leaveType = todayLeave['leaveType'];
      // const period = todayLeave['period'];
      Object.keys(response).forEach(fullName => {
        (response[fullName] as Leave[]).forEach((todayLeave: Leave) => {
          const leaveType = todayLeave['LeaveType'];
          const period = todayLeave['Period'];

          let color = 'icon-color-default';
          if (leaveType === 'vacation') {
            color = 'icon-color1';
          } else if (leaveType === 'sick') {
            color = 'icon-color2';
          } else if (leaveType === 'personal') {
            color = 'icon-color3';
          } else if (leaveType === 'Other') {
            color = 'icon-color4';
          }

          let icon = 'beach_access';
          if (leaveType === 'sick') {
            icon = 'medical_services';
          } else if (leaveType === 'personal') {
            icon = 'person';
          } else if (leaveType === 'Other') {
            icon = 'event-busy';
          }

          let typeText = ''
          if (leaveType === 'vacation') {
            typeText = 'Vacation';
          } else if (leaveType === 'sick') {
            typeText = 'Sick Leave';
          } else if (leaveType === 'personal') {
            typeText = 'Personal Leave';
          } else if (leaveType === 'Other') {
            typeText = 'Other Leave';
          }

          this.todayLeaves.push({
              name: fullName,
              type: typeText,
              icon: icon,
              period: period,
              colorClass: color
            });
          });
        });

      console.log('this.todayLeaves:', this.todayLeaves);
    });
  }
  
    // const mockLeaves = [
    //   { name: 'Will Smith', date: '2024-06-26', type: 'Vacation', icon: 'beach_access', period: 'both', colorClass: 'icon-color1'  },
    //   { name: 'Thor Odinson', date: '2024-06-26', type: 'Personal Leave', icon: 'person', period: 'day', colorClass: 'icon-color3' },
    //   { name: 'William Afton', date: '2024-06-26', type: 'Sick Leave', icon: 'medical_services', period: 'night', colorClass: 'icon-color2' },
    //   { name: 'Bruce Wayne', date: '2024-06-26', type: 'Personal Leave', icon: 'person', period: 'both', colorClass: 'icon-color3' }
    // ];

    // const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
    // this.todayLeaves = mockLeaves.filter(leave => leave.date === today);
  //}

  getGroupedLeaves(): GroupedLeaves {
    return this.todayLeaves.reduce((acc: GroupedLeaves, leave) => {
      if (!acc[leave.name]) {
        acc[leave.name] = [];
      }
      acc[leave.name].push(leave);
      return acc;
    }, {} as GroupedLeaves);
  }
  
  getUniqueNames(): any {
    const grouped: { [key: string]: any[] } = {};
    this.todayLeaves.forEach(leave => {
      if (!grouped[leave.name]) {
        grouped[leave.name] = [];
      }
      grouped[leave.name].push(leave);
    });
    return grouped;
  }

  getUniqueNamesCount(): number {
    const uniqueNames = new Set(this.todayLeaves.map(leave => leave.name));
    return uniqueNames.size;
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

      const totalVacationLeave = usedVacationLeave + vacationLeaveAvailable;
      const totalSickLeave = usedSickLeave + sickLeaveAvailable;
      const totalPersonalLeave = usedPersonalLeave + personalLeaveAvailable;

      this.remainingLeaves = [
        { type: 'Vacation', used: usedVacationLeave, total: totalVacationLeave, icon: 'beach_access', colorClass: 'icon-color1' },
        { type: 'Sick Leave', used: usedSickLeave, total: totalSickLeave, icon: 'medical_services', colorClass: 'icon-color2' },
        { type: 'Personal Leave', used: usedPersonalLeave, total: totalPersonalLeave, icon: 'person', colorClass: 'icon-color3' }
      ];

      this.changeDetectorRef.detectChanges();
    });
  }
}
