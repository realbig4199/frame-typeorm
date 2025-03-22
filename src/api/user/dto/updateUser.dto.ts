import { OmitType, PartialType } from '@nestjs/swagger';
import { SignupDtoTx } from './signup.dto';

export class UpdateUserDtoTx extends PartialType(
  OmitType(SignupDtoTx, ['passid']),
) {}
