import { PartialType } from '@nestjs/swagger';
import { CreateDtoTx } from './create.dto';

export class UpdateDtoTx extends PartialType(CreateDtoTx) {}
