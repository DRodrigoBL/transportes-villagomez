import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Subscription, Subject } from 'rxjs';
import { Truck } from '../model/truck.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TrucksService {
  trucksLoaded = new Subject<Truck[]>();
  trucks: Truck[];

  private serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  public findAllTrucks() {
    this.serviceSubs.push(
      this.db
        .collection('trucks', trucksRef => trucksRef.orderBy('name'))
        .snapshotChanges()
        .pipe(
          map(docArray =>
            docArray.map(doc => {
              const data = doc.payload.doc.data() as Truck;
              const id = doc.payload.doc.id;
              return { id, ...data };
            })
          )
        )
        .subscribe(
          (foundTrucks: Truck[]) => {
            this.trucks = foundTrucks;
            this.trucksLoaded.next([...this.trucks]);
          },
          error => {
            console.log('Error occured while loading Trucks: ' + error.message);
            this.trucksLoaded.next(null);
          }
        )
    );
  }

  cancelSubscriptions() {
    this.serviceSubs.forEach(sub => sub.unsubscribe());
  }
}
