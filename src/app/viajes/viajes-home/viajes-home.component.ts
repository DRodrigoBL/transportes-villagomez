import { Component, OnInit } from '@angular/core';
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
export class ViajesHomeComponent implements OnInit {

  trucks: Truck[];
  cargas: Carga;

  momentDate: Moment;
  date: FormControl;

  displayCargas: boolean;
  displayTrucks: boolean;
  private trucksSubscription: Subscription;


  constructor(
    private trucksService: TrucksService,
    // private cargasService: LoadsService,
    private viajesService: ViajesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dateUtilsService: DateUtilsService
  ) {}

  ngOnInit() {
    // this.configureTrucksSubscription();
    // this.configureLoadsSubscription();
    this.momentDate = moment();
    this.fetchInformation();
  }

  fetchInformation() {
    this.displayTrucks = false;
    this.displayCargas = false;
    this.viajesService.findViajesByDateStr(this.dateUtilsService.formatDate(this.momentDate));
    this.trucksService.findAllTrucks();
  }

}
