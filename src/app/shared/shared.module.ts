import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { AlertComponent } from './alert/alert.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RestrictInputDirective } from './directive/inputFilter.directive';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule

  ],
  declarations: [
    ConfirmationComponent,
    LoadingComponent,
    AlertComponent,
    RestrictInputDirective
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    LoadingComponent,
    RestrictInputDirective
  ]
})
export class SharedModule { }
