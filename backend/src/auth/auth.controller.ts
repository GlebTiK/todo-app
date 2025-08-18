import { Body, Controller, Post, BadRequestException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const res = await this.auth.register(dto.username, dto.password)
    if (!res) throw new BadRequestException('Username already in use')
    return res
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const res = await this.auth.login(dto.username, dto.password)
    if (!res) throw new BadRequestException('Invalid credentials')
    return res
  }
}
