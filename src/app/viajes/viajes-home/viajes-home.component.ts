import { Component, OnInit } from '@angular/core';
import { DateUtilsService } from '../../shared/date.utils.service';

@Component({
  selector: 'app-viajes-home',
  templateUrl: './viajes-home.component.html',
  styleUrls: ['./viajes-home.component.css']
})
export class ViajesHomeComponent implements OnInit {

  constructor(private dateUtilsService: DateUtilsService) { }

  ngOnInit() {
    console.log(this.dateUtilsService.getNextBusinessDayFromDate('25-10-2019'));
  }

}
