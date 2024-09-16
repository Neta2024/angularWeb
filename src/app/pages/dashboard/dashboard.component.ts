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

  selectedYear: string = '';
  todayLeaves: { name: string, type: string, icon: string, period: string, colorClass: string }[] = [];
  remainingLeaves: { type: string, used: number, total: number, icon: string, colorClass: string }[] = [];

  constructor(private restApi: RestApi, private changeDetectorRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.selectedYear = new Date().getFullYear().toString();  // Get current year as a string
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

      console.log(response);

      this.todayLeaves = [];

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
      
      
      const usedSickLeave = response.used['Used Sick leave'] || 0;
      const usedPersonalLeave = response.used['Used Personal leave'] || 0;

      const vacationLeaveAvailable = response.remain['Vacation Leave Available'] || 0;   //Vacation Leave Available for future report 
      const sickLeaveAvailable = response.remain['Sick Leave Available'] || 0;
      const personalLeaveAvailable = response.remain['Personal Leave Available'] || 0;

      const usedVacationLeave = response.quota['Total Used Vacation leave'];
      const totalVacationLeave = response.quota['Total Vacation leave'];

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
