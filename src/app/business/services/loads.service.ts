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
    // const info =
    //   '{"fechaCarga":"11/08/2019","cargasDetalles":[{"camioneta":"C04","chofer":"JUAN MANUEL OZUNA GUAPO","ayudante":"DAMIAN ANDRADE GRANILLO","origen":{"origenId":"1","nombreOrigen":"ROSHFRANS"},"destino":{"destinoId":"1","nombreDestino":"ACTOPAN"},"productos":[{"productoId":"10","nombreProducto":"IMPRESION AMARILLA","cantidad":10,"remision":"ABC","unidadMedida":"BOLSA","unidadesPorMedida":10}]}]}';
    // const carga = JSON.parse(info);
    // try {
    //   this.db
    //     .collection('cargas')
    //     .doc('13-08-2019')
    //     .set(carga);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  public saveCarga(carga: Carga) {
    console.log('before saving carga current: ' + JSON.stringify(carga));

    const docRef = this.db.collection('cargas').doc(carga.fechaCarga);

    this.cargasByDate.cargasDetalles.push(carga.cargasDetalles[0]);
    docRef
      .set({
        'fechaCarga': '13-08-2019',
        'cargasDetalles': JSON.parse(JSON.stringify(this.cargasByDate.cargasDetalles))
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
      .collection('origen-destino-producto')
      .valueChanges()
      .subscribe(
        (foundOrigenDestinoProducto: Origen[]) => {
          console.log(
            'found origenes: ' + JSON.stringify(foundOrigenDestinoProducto)
          );
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
