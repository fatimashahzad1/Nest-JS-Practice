import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('Token must be present');
    }
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
