import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Carga } from 'src/app/business/model/carga.model';
import { Subject } from 'rxjs';
import { DateUtilsService } from './date.utils.service';

@Injectable()
export class ViajesService {
  viajesByDateLoaded = new Subject<Carga>();
  viajesByDate: Carga;

  constructor(
    private db: AngularFirestore,
    private dateUtilsService: DateUtilsService
  ) {}

  public findViajesByDateStr(dateStr: string) {
    console.log('findViajesByDateStr: ' + dateStr);

    this.db
      .doc<Carga>('viajes/' + dateStr)
      .valueChanges()
      .subscribe(
        (foundViaje: Carga) => {
          console.log('found viajes: ' + JSON.stringify(foundViaje));
          if (!foundViaje || foundViaje.cargasDetalles.length === 0) {
            this.viajesByDate = {
              fechaCarga: dateStr,
              fechaServicio: this.dateUtilsService.getNextBusinessDayFromDate(
                dateStr
              ),
              cargasDetalles: []
            };
          } else {
            this.viajesByDate = foundViaje;
          }
          this.viajesByDateLoaded.next({
            ...this.viajesByDate
          });
        },
        error => {
          console.log('Error occured while searching Viajes: ' + error.message);
          this.viajesByDateLoaded.next(null);
        }
      );
  }
}
