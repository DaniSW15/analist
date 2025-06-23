import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  quantityUnits?: string;
}
