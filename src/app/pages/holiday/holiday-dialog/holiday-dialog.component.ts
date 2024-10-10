import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/shared/components/alert/alert';

@Component({
  selector: 'app-holiday-dialog',
  templateUrl: './holiday-dialog.component.html',
  styleUrl: './holiday-dialog.component.scss'
})
export class HolidayDialogComponent implements OnInit{

  @Input() mode: 'add' | 'edit';

  @Input() isAddMode: boolean;
  @Input() holiday: any = {};

  holidayForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private alert: Alert,
    public activeModal: NgbActiveModal,) {
    }

  ngOnInit(): void {
    // Initialize the form
    if(this.mode === 'add' && this.holiday){
      this.holidayForm = this.fb.group({
        holiday_name: ['', Validators.required],
        holiday_date: ['', Validators.required],
      
      });
    }
    
    if (this.mode === 'edit' && this.holiday) {
      // Patch the form with the holiday data in edit mode
      this.holidayForm = this.fb.group({
        holiday_name: ['', Validators.required],
        holiday_date: ['', Validators.required],
       
      });

      this.holidayForm.patchValue({
        holiday_name: this.holiday.name,
        holiday_date: this.holiday.date
        
     }
    );
     
    }

  }

  addHoliday(){
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const holidayRequest = {
      holiday: this.holidayForm.get('holiday_date').value,
      holidayName: this.holidayForm.get('holiday_name').value,
    }
    
    this.activeModal.close(holidayRequest);

  }

  editHoliday(){
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const holidayRequest = {
      holiday: this.holidayForm.get('holiday_date').value,
      holidayName: this.holidayForm.get('holiday_name').value,
    }
    this.activeModal.close(holidayRequest);
  }

  onSubmit() {
    if (this.mode === 'add') {
      this.addHoliday();
    } else if (this.mode === 'edit') {
      this.editHoliday();
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }


}
