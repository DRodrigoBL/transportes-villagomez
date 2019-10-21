import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogComponent } from './dialog/confirmation.dialog';

import { MaterialModule } from '../material.module';
import { DateUtilsService } from './date.utils.service';
import { ViajesService } from './services/viajes.service';

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
  providers: [DateUtilsService, ViajesService],
  declarations: [ConfirmationDialogComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class SharedModule {}
