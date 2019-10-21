import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogComponent } from './dialog/confirmation.dialog';


import { MaterialModule } from '../material.module';
import { DateUtilsService } from './date.utils.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [DateUtilsService],
  declarations: [ConfirmationDialogComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class SharedModule {}
