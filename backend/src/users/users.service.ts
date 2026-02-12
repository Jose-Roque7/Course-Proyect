import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/common/utils/bycriptHas';

@Injectable()
export class UsersService {

  //! SI CAMBIO PASSWORD (OPCION DEL USER) O EL ROLE, DEBO HACER UN (user.tokenVersion += 1;)

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest} = createUserDto;
    const user = await this.findOne(createUserDto.user);
    if (user === 'User not found') {
      const newUser = this.userRepository.create({...rest, password:await hashPassword(password)});
      await this.userRepository.save(newUser);
      const { password: _, createdAt, tokenVersion , updatedAt, ...userWithoutSensitive } = newUser;
    return userWithoutSensitive;;
    } else {
      return 'User already exists';
    }
  }

  async findAll() {
    const users = await this.userRepository.find({});
    return users.map(({ password, tokenVersion ,  createdAt, updatedAt, ...userWithoutSensitive }) => userWithoutSensitive);
  }

  async findOne(user: string) {
    const users = await this.userRepository.findOne({where: {user}});
    if (!users) {
      return 'User not found';
    }
    const { password, createdAt, tokenVersion , updatedAt, ...userWithoutSensitive } = users;
    return userWithoutSensitive ;
  }

  async findOneToken(id: string) {
    const user = await this.userRepository.findOne({where: {id}, select: ['tokenVersion']});
    if (!user) {
      return 'User not found';
    }
    return user;
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return 'User not found';
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }
    if (updateUserDto.role && updateUserDto.role !== user.role) {
      (updateUserDto as any).tokenVersion = user.tokenVersion + 1;
    }
    await this.userRepository.update(id, updateUserDto);
    const userUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userUpdate) return 'User not found';
    const { password, createdAt, tokenVersion , updatedAt, ...userWithoutSensitive } = userUpdate;
    return userWithoutSensitive;
  }

  async updateReloadToken(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return 'User not found';
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }
    await this.userRepository.update(id,{...updateUserDto, tokenVersion: user.tokenVersion + 1});
    const userUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userUpdate) return 'User not found';
    const { password, createdAt, tokenVersion , updatedAt, ...userWithoutSensitive } = userUpdate;
    return userWithoutSensitive;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({where: {id: id}});
    if (!user) return 'User not found';
    await this.userRepository.delete(id);
    return 'executed';
  }
}
