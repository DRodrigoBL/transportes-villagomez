import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';

import { TrucksService } from '../services/trucks.service';
import { LoadsService } from '../services/loads.service';

import { Truck } from '../model/truck.model';
import { Load } from '../model/load.model';
import { Subscription } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css']
})
export class LoadsComponent implements OnInit, OnDestroy {
  trucks: Truck[];
  loads: Load[];

  momentDate: Moment;
  date: FormControl;

  displayLoads: boolean;
  displayTrucks: boolean;
  private trucksSubscription: Subscription;

  constructor(
    private trucksService: TrucksService,
    private loadsService: LoadsService
  ) {}

  ngOnInit() {
    this.momentDate = moment();
    this.date = new FormControl(this.momentDate);
    this.configureTrucksSubscription();
    this.configureLoadsSubscription();
    this.fetchInformation();
  }

  fetchInformation() {
    this.displayTrucks = false;
    this.displayLoads = false;
    this.loadsService.findLoadsByDateStr(this.momentDate.format('DD/MM/YYYY'));
    this.trucksService.findAllTrucks();
  }

  configureTrucksSubscription() {
    this.trucksService.trucksLoaded.subscribe((loadedTrucks: Truck[]) => {
      this.trucks = loadedTrucks;
      this.displayTrucks = true;
      console.log('loaded trucks: ' + JSON.stringify(this.trucks));
    });
  }

  configureLoadsSubscription() {
    this.loadsService.loadsByDateLoaded.subscribe((loadedLoads: Load[]) => {
      this.loads = loadedLoads;
      this.displayLoads = true;
      console.log('loaded loads: ' + JSON.stringify(this.loads));
    });
  }

  truckHasLoad(truckName: string) {
    for (const load of this.loads) {
      if (load.camioneta === truckName) {
       return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    if (this.trucksSubscription) {
      this.trucksSubscription.unsubscribe();
    }
  }

  findLoads(dateEvent: MatDatepickerInputEvent<Moment>) {
    this.momentDate = moment(dateEvent.value);
    console.log(
      'finding new info for date: ' + this.momentDate.format('DD/MM/YYYY')
    );

    this.fetchInformation();
  }
}
