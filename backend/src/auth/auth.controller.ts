import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto} from './dto/auth.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @Get('validate')
  validate() {
    return 'Valid Token';
  }

}