import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDialog,
  MatSnackBar
} from '@angular/material';

import { TrucksService } from '../services/trucks.service';
import { LoadsService } from '../services/loads.service';

import { Truck } from '../model/truck.model';
import { Subscription } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';
import { Carga } from '../model/carga.model';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation.dialog';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css']
})
export class LoadsComponent implements OnInit, OnDestroy {
  trucks: Truck[];
  cargas: Carga;

  momentDate: Moment;
  date: FormControl;

  displayCargas: boolean;
  displayTrucks: boolean;
  private trucksSubscription: Subscription;

  constructor(
    private trucksService: TrucksService,
    private cargasService: LoadsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargasService.saveInfo();
    this.momentDate = moment();
    this.date = new FormControl(this.momentDate);
    this.configureTrucksSubscription();
    this.configureLoadsSubscription();
    this.fetchInformation();
  }

  fetchInformation() {
    this.displayTrucks = false;
    this.displayCargas = false;
    this.cargasService.findCargasByDateStr(this.formatDate());
    this.trucksService.findAllTrucks();
  }

  configureTrucksSubscription() {
    this.trucksService.trucksLoaded.subscribe((loadedTrucks: Truck[]) => {
      this.trucks = loadedTrucks;
      this.displayTrucks = true;
      // console.log('loaded trucks: ' + JSON.stringify(this.trucks));
    });
  }

  configureLoadsSubscription() {
    this.cargasService.cargasByDateLoaded.subscribe((loadedCargas: Carga) => {
      this.cargas = loadedCargas;
      if (!this.cargas) {
        console.log('no hay cargas');
      }
      this.displayCargas = true;
      console.log('loaded cargas: ' + JSON.stringify(this.cargas));
    });
  }

  deleteCarga(truckName: string) {
    for (const carga of this.cargas.cargasDetalles) {
      if (carga.camioneta === truckName) {
        const cargaToDelete: Carga = {
          fechaCarga: this.formatDate(),
          fechaServicio: '',
          cargasDetalles: [carga]
        };
        console.log('carga to delete in component:');
        console.log(cargaToDelete);
        this.cargasService.deleteCarga(cargaToDelete);
        break;
      }
    }
  }

  truckHasLoad(truckName: string) {
    for (const carga of this.cargas.cargasDetalles) {
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

  findLoads(dateEvent: MatDatepickerInputEvent<Moment>) {
    this.momentDate = moment(dateEvent.value);
    console.log('finding new info for date: ' + this.formatDate());

    this.fetchInformation();
  }

  formatDate(): string {
    return this.momentDate.format('DD-MM-YYYY');
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
        this.deleteCarga(truckName);
        this.snackBar.open('Carga eliminada', 'Ok', {
          duration: 2000
        });
      }
    });
  }
}
