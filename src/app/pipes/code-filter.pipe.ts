import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'codeFilter', standalone: true })
export class CodeFilterPipe implements PipeTransform {
  transform(items: any[], code: string): any[] {
    if (!items || !code) return items;
    return items.filter(it => it.intakeCode === code);
  }
}
