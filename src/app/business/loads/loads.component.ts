import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';

import { TrucksService } from '../services/trucks.service';
import { LoadsService } from '../services/loads.service';

import { Truck } from '../model/truck.model';
import { Subscription } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';
import { Carga } from '../model/carga.model';

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
    private cargasService: LoadsService
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
    console.log(
      'finding new info for date: ' + this.formatDate()
    );

    this.fetchInformation();
  }

  formatDate(): string {
    return this.momentDate.format('DD-MM-YYYY');
  }
}
