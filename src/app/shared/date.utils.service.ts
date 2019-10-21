import { Injectable } from '@angular/core';

import * as moment from 'moment';


@Injectable()
export class DateUtilsService {

    public readonly DATE_FORMAT = 'DD-MM-YYYY';
    public readonly SATURDAY_INDEX = 6;

    public getNextBusinessDayFromDate(date: string): string {
        const momentDate = moment(date, this.DATE_FORMAT);
        const dayOfWeek = momentDate.day();
        if (dayOfWeek === this.SATURDAY_INDEX) {
            return momentDate.day(1).format(this.DATE_FORMAT);
        }
        return momentDate.day(dayOfWeek + 1).format(this.DATE_FORMAT);
    }


}
