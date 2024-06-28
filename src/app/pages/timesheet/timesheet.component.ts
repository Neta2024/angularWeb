import { Component, OnInit } from '@angular/core';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  constructor(private rest: RestApi) { }

  ngOnInit() {
    // let data = { yearRequest: 2024 };
    // this.rest.post('dashboard/summary-leave', data).subscribe(res => {
    //   console.log(res);
    // });

    this.rest.post('session').subscribe(res => {
      console.log(res);
    });
  }

}
