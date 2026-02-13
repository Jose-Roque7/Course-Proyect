import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePassword } from 'src/common/utils/bycriptHas';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async login(authDto: AuthDto) {
        const users = await this.userRepository.findOne({where: {user: authDto.user}});
        if (!users) return 'Invalid User';
        if (users.status === false) return 'User Disabled';
        const passwordMatch = await comparePassword(authDto.password, users.password);
        if (!passwordMatch) return 'Invalid User';
        const payload = {
            id: users.id,
            user: users.user,
            role: users.role,
            tokenVersion: users.tokenVersion,
        };
        return {accesToken: this.jwtService.sign(payload) };
    }
}
