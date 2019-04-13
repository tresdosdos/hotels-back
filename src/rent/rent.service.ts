import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Symbols } from '../symbols';
import { Hotel, Image, Rent, Room, User } from '../db/models';
import {IRent} from './interfaces';

@Injectable()
export class RentService {
    constructor(
        @Inject(Symbols.Rent) private rent: typeof Rent,
        @Inject(Symbols.User) private user: typeof User,
    ) {}

    public async createRent(userId: number, rent: IRent) {
        const newRent = new this.rent({
            userId,
            ...rent,
        });
        try {
            await newRent.save()
        } catch (err) {
            console.log(err);
        }
    }
}
