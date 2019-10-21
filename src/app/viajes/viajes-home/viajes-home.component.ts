import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDialog,
  MatSnackBar
} from '@angular/material';

import { TrucksService } from '../../business/services/trucks.service';
import { LoadsService } from '../../business/services/loads.service';

import { Truck } from '../../business/model/truck.model';
import { Carga } from '../../business/model/carga.model';

import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation.dialog';

import { Subscription } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';


import { DateUtilsService } from '../../shared/services/date.utils.service';
import { ViajesService } from '../../shared/services/viajes.service';

@Component({
  selector: 'app-viajes-home',
  templateUrl: './viajes-home.component.html',
  styleUrls: ['./viajes-home.component.css']
})
export class ViajesHomeComponent implements OnInit, OnDestroy {

  trucks: Truck[];
  viajes: Carga;

  momentDate: Moment;
  date: FormControl;

  displayViajes: boolean;
  displayTrucks: boolean;
  private trucksSubscription: Subscription;


  constructor(
    private trucksService: TrucksService,
    private viajesService: ViajesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dateUtilsService: DateUtilsService
  ) {}

  ngOnInit() {
    this.configureTrucksSubscription();
    this.configureLoadsSubscription();
    this.momentDate = moment();
    this.fetchInformation();
  }

  fetchInformation() {
    this.displayTrucks = false;
    this.displayViajes = false;
    this.viajesService.findViajesByDateStr(this.dateUtilsService.formatDate(this.momentDate));
    this.trucksService.findAllTrucks();
  }

  configureTrucksSubscription() {
    this.trucksService.trucksLoaded.subscribe((loadedTrucks: Truck[]) => {
      this.trucks = loadedTrucks;
      this.displayTrucks = true;
    });
  }

  configureLoadsSubscription() {
    this.viajesService.viajesByDateLoaded.subscribe((loadedViajes: Carga) => {
      this.viajes = loadedViajes;
      if (!this.viajes) {
        console.log('no hay viajes');
      }
      this.displayViajes = true;
      console.log('loaded viajes: ' + JSON.stringify(this.viajes));
    });
  }

  findViajes(dateEvent: MatDatepickerInputEvent<Moment>) {
    this.momentDate = moment(dateEvent.value);
    console.log('finding new info for date: ' + this.dateUtilsService.formatDate(this.momentDate));
    this.fetchInformation();
  }

  truckHasViaje(truckName: string) {
    for (const carga of this.viajes.cargasDetalles) {
      if (carga.camioneta === truckName) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    console.log('unsubscribing observables in loads.component.ts');
    if (this.trucksSubscription) {
      this.trucksSubscription.unsubscribe();
    }
  }

  openDialog(truckName: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Estas seguro que deseas eliminar la carga?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });
    const snack = this.snackBar;

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // this.deleteCarga(truckName);
        console.log('Accion a tomar');
        this.snackBar.open('Accion a tomar', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  formatDate(): string {
    return this.dateUtilsService.formatDate(this.momentDate);
  }

}
