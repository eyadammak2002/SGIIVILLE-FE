import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 100, trail = '...'): string {
    if (!value) return '';
    const v = String(value);
    return v.length > limit ? v.substring(0, limit) + trail : v;
  }
}
