import { Pipe, PipeTransform } from '@angular/core';
import moment = require('moment');

@Pipe({name: 'hour'})
export class HourPipe implements PipeTransform {
  transform(value: moment.Moment): string {
    return value.format('ha');
  }
}