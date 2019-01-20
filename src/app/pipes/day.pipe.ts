import { Pipe, PipeTransform } from '@angular/core';
import moment = require('moment');

@Pipe({name: 'day'})
export class DayPipe implements PipeTransform {
  transform(value: moment.Moment): string {
    return value.format('L');
  }
}