import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(username: string, password: string) {
    const user = await this.users.create(username, password)
    if (!user) return null
    const token = await this.sign(user.id, user.username)
    return { access_token: token }
  }

  async login(username: string, password: string) {
    const user = await this.users.validate(username, password)
    if (!user) return null
    const token = await this.sign(user.id, user.username)
    return { access_token: token }
  }

  private async sign(sub: number, username: string) {
    return this.jwt.signAsync({ sub, username })
  }
}
