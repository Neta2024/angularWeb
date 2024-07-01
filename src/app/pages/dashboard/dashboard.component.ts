import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedYear: string = 'option1';
  todayLeaves: { name: string, type: string, icon: string, period: string, colorClass: string }[] = [];
  remainingLeaves: { type: string, used: number, total: number, icon: string, colorClass: string }[] = [];

  constructor() { }

  ngOnInit() {
    this.getTodayLeaves();
    this.getRemainingLeaves();
  }

  onChange(selectedValue: string): void {
    this.selectedYear = selectedValue;
  }

  getTodayLeaves(): void {
    const mockLeaves = [
      { name: 'Will Smith', date: '2024-06-26', type: 'Vacation', icon: 'beach_access', period: 'both', colorClass: 'icon-color1'  },
      { name: 'Thor Odinson', date: '2024-06-26', type: 'Personal Leave', icon: 'person', period: 'day', colorClass: 'icon-color3' },
      { name: 'William Afton', date: '2024-06-26', type: 'Sick Leave', icon: 'medical_services', period: 'night', colorClass: 'icon-color2' },
      { name: 'Bruce Wayne', date: '2024-06-26', type: 'Personal Leave', icon: 'person', period: 'both', colorClass: 'icon-color3' }
    ];

    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
    this.todayLeaves = mockLeaves.filter(leave => leave.date === today);
  }

  getRemainingLeaves(): void {
    this.remainingLeaves = [
      { type: 'Vacation', used: 4, total: 12, icon: 'beach_access', colorClass: 'icon-color1' },
      { type: 'Sick Leave', used: 2, total: 30, icon: 'medical_services', colorClass: 'icon-color2' },
      { type: 'Personal Leave', used: 3, total: 3, icon: 'person', colorClass: 'icon-color3' }
    ];
  }
}
