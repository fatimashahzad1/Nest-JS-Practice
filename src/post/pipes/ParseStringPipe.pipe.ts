import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform {
  transform(value: any) {
    console.log('stringPipe=', value);
    if (typeof value === 'string' && isNaN(+value)) {
      return value.trim(); // Trim the whitespace from the string
    }
    throw new BadRequestException('searchString must be a string');
  }
}
