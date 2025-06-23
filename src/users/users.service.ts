import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpInput } from 'src/auth/dto/inputs/signup.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(signupInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(newUser);

    } catch (error) {
      this.hasdleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
      // this.hasdleDBError({
      //   code: 'error-001',
      //   detail: `User with email ${email} not found`,
      // });
    }
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`User with ID ${id} not found`);
  }

  private hasdleDBError(error: any): never {
    if (error.code === '23505') { // Unique constraint violation
      throw new BadRequestException(error.detail.replace('Key (email)=', 'Email already exists: '));
    } else if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('User with email ', 'User with email '));
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
