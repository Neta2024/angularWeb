import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-delete-event-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-event-dialog.component.html',
  styleUrl: './delete-event-dialog.component.scss'
})
export class DeleteEventDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restApi: RestApi // Inject your REST API service
  ) {
    console.log('Dialog Data:', this.data);
  }

  confirmDelete(): void {
    const eventId = this.data.eventId; // Assuming you pass eventId to the dialog

    console.log(eventId);
    // Call your REST API service to delete the event
    // ให้ tola ลองเช็คให้ว่าทำไมถึงลบสองอัน
    this.restApi.delete('/timesheets/delete', { body: eventId }).subscribe(
      () => {
        console.log('Event deleted successfully.');
        this.dialogRef.close(true); // Close dialog with a confirmation
      },
      error => {
        console.error('Error deleting event:', error);
        // Handle error if needed
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close(false); // Close dialog without deleting
  }

}
