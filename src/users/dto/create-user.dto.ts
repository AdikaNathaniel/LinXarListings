import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { userTypes } from 'src/shared/schema/users';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([userTypes.ADMIN, userTypes.CUSTOMER,userTypes.REAL_ESTATE_AGENT,userTypes.PROPERTY_OWNER,userTypes.GUEST,userTypes.CUSTOMER_SUPPORT_AGENT])
  type: string;

  @IsString()
  @IsOptional()
  secretToken?: string;

  isVerified?: boolean;
}

