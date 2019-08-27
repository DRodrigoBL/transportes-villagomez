import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Subscription, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Origen } from '../model/origen.model';
import { Carga } from '../model/carga.model';
import * as firebase from 'firebase/app';
import { UpdateCarga } from '../loads/cargas.actions';

@Injectable()
export class LoadsService {
  cargasByDateLoaded = new Subject<Carga>();
  cargasByDate: Carga;

  origenesLoaded = new Subject<Origen[]>();
  origenes: Origen[];

  private serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  public findCargasByDateStr(dateStr: string) {
    // this.db
    //   .collection('cargas', ref => ref.where('fechaCarga', '==', dateStr))
    this.db
      .doc<Carga>('cargas/' + dateStr)
      .valueChanges()
      .subscribe(
        (foundCarga: Carga) => {
          console.log('found cargas: ' + JSON.stringify(foundCarga));
          if (!foundCarga || foundCarga.cargasDetalles.length === 0) {
            this.cargasByDate = {
              fechaCarga: dateStr,
              cargasDetalles: []
            };
          } else {
            this.cargasByDate = foundCarga;
          }
          this.cargasByDateLoaded.next({
            ...this.cargasByDate
          });
        },
        error => {
          console.log('Error occured while loading Cargas: ' + error.message);
          this.cargasByDateLoaded.next(null);
        }
      );
  }

  public saveInfo() {
    console.log('save info method doing nothing');

    // const info =
    //   '';
    // const obj = JSON.parse(info);
    // try {
    //   this.db
    //     .collection('origen-destino-producto')
    //     .add(obj);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  public updateCarga(carga: Carga) {
    const docRef = this.db.collection('cargas').doc(carga.fechaCarga);
    let indexToReplace = 0;
    for (const cargaToUpdate of this.cargasByDate.cargasDetalles) {
      if (cargaToUpdate.camioneta === carga.cargasDetalles[0].camioneta) {
        break;
      }
      indexToReplace++;
    }
    this.cargasByDate.cargasDetalles[indexToReplace] = carga.cargasDetalles[0];
    console.log('before updating carga current: ');
    console.log(this.cargasByDate);
    docRef
      .set({
        fechaCarga: '13-08-2019',
        cargasDetalles: JSON.parse(JSON.stringify(this.cargasByDate.cargasDetalles))
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
  }

  public saveCarga(carga: Carga) {
    // console.log('before saving carga current: ' + JSON.stringify(carga));

    const docRef = this.db.collection('cargas').doc(carga.fechaCarga);
    this.cargasByDate.cargasDetalles.push(carga.cargasDetalles[0]);

    // console.log('object assign used to save the object>');
    // console.log(Object.assign({}, this.cargasByDate.cargasDetalles));
    // TODO: REVISAR PORQUE FUNCIONA DIFERENTE
    // console.log('json parse used to save the object>');
    // console.log(JSON.parse(JSON.stringify(this.cargasByDate.cargasDetalles)));
    docRef
      .set({
        fechaCarga: '13-08-2019',
        cargasDetalles: JSON.parse(JSON.stringify(this.cargasByDate.cargasDetalles))
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });

    // this.db
    //   .doc<Carga>('cargas/' + carga.fechaCarga)
    //   .set(this.cargasByDate)
    //   .then(() => console.log('cargas updated successfully'))
    //   .catch(error => console.log(error));
  }

  public fetchOrigenes() {
    this.db
      .collection('origen-destino-producto', ref => ref.orderBy('nombreOrigen'))
      .valueChanges()
      .subscribe(
        (foundOrigenDestinoProducto: Origen[]) => {
          // console.log(
          //   'found origenes: ' + JSON.stringify(foundOrigenDestinoProducto)
          // );
          this.origenes = foundOrigenDestinoProducto;
          this.origenesLoaded.next(this.origenes.slice());
        },
        error => {
          console.log('Error occured while loading Origenes: ' + error.message);
          this.cargasByDateLoaded.next(null);
        }
      );
  }

  cancelSubscriptions() {
    this.serviceSubs.forEach(sub => sub.unsubscribe());
  }
}
