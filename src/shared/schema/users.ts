import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum userTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  REAL_ESTATE_AGENT = 'real-estate-agent',
  PROPERTY_OWNER ='property-owner',
  GUEST = 'guest',
  CUSTOMER_SUPPORT_AGENT = 'customer-support-agent'
}

@Schema({
  timestamps: true,
})
export class Users extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: [userTypes.ADMIN, userTypes.CUSTOMER,userTypes.REAL_ESTATE_AGENT,userTypes.PROPERTY_OWNER,userTypes.GUEST,userTypes.CUSTOMER_SUPPORT_AGENT]})
  type: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  otp: string;

  @Prop({ default: null })
  otpExpiryTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);
