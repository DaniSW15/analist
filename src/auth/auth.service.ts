import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private getJwtToken(userId: string) {
        return this.jwtService.sign({ id: userId });
    }

    async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
        const user = await this.usersService.create(signUpInput);

        const accessToken = this.getJwtToken(user.id);
        return {
            accessToken,
            user,
        };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);

        if (!user.password || !bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Email or password is incorrect');
        }

        const accessToken = this.getJwtToken(user.id);
        
        return {
            accessToken,
            user,
        };
    }

    revalidateToken(): string {
        // This method would typically revalidate the user's token
        // For simplicity, we return a static message
        return 'Token revalidated successfully';
    }

    async validateUser(id: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        delete user.password;
        return user;
    }
}
