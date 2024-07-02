import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg)
  };
  
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    
  }

  handleDateClick(arg: any) {
    console.log(arg);
    const modalRef = this.modalService.open(AddEventDialogComponent, { size: 'lg', backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.date = arg;
  }

}
