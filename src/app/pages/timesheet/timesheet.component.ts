import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/shared/components/alert/alert';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  constructor(private rest: RestApi, private alert: Alert) { }

  ngOnInit() {
    // let data = { yearRequest: 2024 };
    // this.rest.post('dashboard/summary-leave', data).subscribe(res => {
    //   console.log(res);
    // });

    this.rest.post('session').subscribe(res => {
      console.log(res);
    });
  }

  test() {
    this.alert.info("Test message", 10000);
  }
}
