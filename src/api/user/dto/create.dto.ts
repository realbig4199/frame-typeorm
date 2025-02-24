import { LoginEntity } from '@/database/entity/login.entity';

export class CreateDtoTx {
  public name: string;

  public login: LoginEntity;
}
