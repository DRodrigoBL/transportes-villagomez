import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrucksService } from '../services/trucks.service';

import { Truck } from '../model/truck.model';
import { Load } from '../model/load.model';
import { Subscription } from 'rxjs';
import { LoadsService } from '../services/loads.service';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css']
})
export class LoadsComponent implements OnInit, OnDestroy {
  trucks: Truck[];
  loads: Load[];

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
  }

  ngOnDestroy() {
    if (this.trucksSubscription) {
      this.trucksSubscription.unsubscribe();
    }
  }
}
