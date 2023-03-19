/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
