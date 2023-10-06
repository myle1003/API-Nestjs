import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(MyJwtGuard)
    @Get('me')
    me(@GetUser() user: User) {
        // return request
        // console.log(JSON.stringify(Object.keys(request)))
        // console.log(request.user);

        return user;
    }
}
