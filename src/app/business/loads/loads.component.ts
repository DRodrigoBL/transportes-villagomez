import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

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

  date = new FormControl(moment());

  displayLoads: boolean;
  private trucksSubscription: Subscription;

  constructor(
    private trucksService: TrucksService,
    private loadsService: LoadsService
  ) {}

  ngOnInit() {
    this.displayLoads = false;
    this.trucksService.trucksLoaded.subscribe((loadedTrucks: Truck[]) => {
      this.trucks = loadedTrucks;
      this.displayLoads = true;
      console.log('loaded trucks: ' + JSON.stringify(this.trucks));
    });
    this.loadsService.loadsByDateLoaded.subscribe((loadedLoads: Load[]) => {
      this.loads = loadedLoads;
      console.log('loaded loads: ' + JSON.stringify(this.loads));
    });
    this.loadsService.findLoadsByDateStr('04/08/2019');
    this.trucksService.findAllTrucks();
    console.log('date> ' + JSON.stringify(this.date));
  }

  ngOnDestroy() {
    if (this.trucksSubscription) {
      this.trucksSubscription.unsubscribe();
    }
  }
}
