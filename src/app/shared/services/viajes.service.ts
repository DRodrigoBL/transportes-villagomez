import { Injectable } from '@angular/core';

@Injectable()
export class ViajesService {

    public findViajesByDateStr(viajeDate: string) {

        console.log('findViajesByDateStr: ' + viajeDate);
    }

}
