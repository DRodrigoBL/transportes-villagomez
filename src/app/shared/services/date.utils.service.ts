import { Injectable } from '@angular/core';

import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable()
export class DateUtilsService {
  public readonly DATE_FORMAT = 'DD-MM-YYYY';
  public readonly SATURDAY_INDEX = 6;
  public readonly SUNDAY_INDEX = 0;

  public getNextBusinessDayFromDate(date: string): string {
    const momentDate = moment(date, this.DATE_FORMAT);
    const dayOfWeek = momentDate.day();
    if (dayOfWeek === this.SATURDAY_INDEX) {
      return momentDate.add(1, 'weeks').day(1).format(this.DATE_FORMAT);
    }
    return momentDate.day(dayOfWeek + 1).format(this.DATE_FORMAT);
  }

  public getTodaysBusinessDate(): Moment {
      const today = moment();
      if (today.day() === this.SUNDAY_INDEX) {
        return today.day(1);
      }
      return today;
  }

  formatDate(momentToFormat: Moment): string {
    return momentToFormat.format(this.DATE_FORMAT);
  }
}
