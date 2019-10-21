import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Carga } from 'src/app/business/model/carga.model';
import { Subject } from 'rxjs';
import { DateUtilsService } from './date.utils.service';
import { CargasDetalles } from '../../business/model/carga.model';

@Injectable()
export class ViajesService {
  viajesByDateLoaded = new Subject<Carga>();
  viajesByDate: Carga;

  constructor(
    private db: AngularFirestore,
    private dateUtilsService: DateUtilsService
  ) {}

  public countViajesPerCamionetaInDetallesArray(camioneta: string): number {
    let totalSum = 0;
    for (const detalle of this.viajesByDate.cargasDetalles) {
      if (detalle.camioneta === camioneta) {
        totalSum++;
      }
    }
    return totalSum;
  }

  public calculateViajeIndex(viaje: CargasDetalles): number {
    return this.countViajesPerCamionetaInDetallesArray(viaje.camioneta);
  }

  public terminarViaje(viaje: Carga) {
    const detallesViaje = viaje.cargasDetalles[0];
    if (!detallesViaje.viajeIndex) {
      detallesViaje.viajeIndex = this.calculateViajeIndex(detallesViaje);
    }
    detallesViaje.isViajeTerminado = true;
    viaje.cargasDetalles[0] = detallesViaje;
    this.updateViaje(viaje);
  }

  public updateViaje(viaje: Carga) {
    const docRef = this.db.collection('viajes').doc(viaje.fechaServicio);
    let indexToReplace = 0;

    for (const viajeToUpdate of this.viajesByDate.cargasDetalles) {
      if (
        viajeToUpdate.camioneta === viaje.cargasDetalles[0].camioneta &&
        viajeToUpdate.viajeIndex === viaje.cargasDetalles[0].viajeIndex
      ) {
        break;
      }
      indexToReplace++;
    }
    this.viajesByDate.cargasDetalles[indexToReplace] = viaje.cargasDetalles[0];
    console.log('before updating viajes current: ');
    console.log(this.viajesByDate);
    docRef
      .set({
        fechaCarga: viaje.fechaCarga,
        fechaServicio: viaje.fechaServicio,
        cargasDetalles: JSON.parse(
          JSON.stringify(this.viajesByDate.cargasDetalles)
        )
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      })
      .finally(() => {
        console.log('executed');
      });
  }

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

  public saveViaje(viaje: Carga) {
    console.log('before saving viaje: ');
    console.log(viaje);

    this.viajesByDate.cargasDetalles.push(viaje.cargasDetalles[0]);

    const viajesDocRef = this.db.collection('viajes').doc(viaje.fechaServicio);
    viajesDocRef
      .set({
        fechaCarga: viaje.fechaCarga,
        fechaServicio: viaje.fechaServicio,
        cargasDetalles: JSON.parse(
          JSON.stringify(this.viajesByDate.cargasDetalles)
        )
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
  }
}
