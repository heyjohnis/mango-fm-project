import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate'
})
export class CustPipe implements PipeTransform {

  transform(value: string): string {
    //return value.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
    return value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8);
  }

}
