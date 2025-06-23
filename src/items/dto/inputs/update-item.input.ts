import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;

  // @Field(() => String, { nullable: true })
  // @IsString()
  // @IsNotEmpty()
  // name: string;

  // @Field(() => Int, { nullable: true })
  // quantity?: number;

  // @Field(() => String, { nullable: true })
  // @IsString()
  // @IsOptional()
  // quantityUnits?: string;
}
