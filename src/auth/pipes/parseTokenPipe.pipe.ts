import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  transform(value: any) {
    console.log('token in pipe=', value);
    const tokenParts = value.split('.');

    // Ensure the token has three parts and each part is non-empty
    const isTokenValid =
      tokenParts.length === 3 && tokenParts.every((part) => part.length > 0);

    if (typeof value === 'string' && isNaN(+value) && isTokenValid) {
      return value.trim(); // Trim the whitespace from the string
    }
    throw new BadRequestException('Token is Invalid.');
  }
}
