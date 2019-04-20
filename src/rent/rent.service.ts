import {Inject, Injectable} from '@nestjs/common';
import {Symbols} from '../symbols';
import {Hotel, Image, Rent, Room, User} from '../db/models';
import {IRent} from './interfaces';

@Injectable()
export class RentService {
    constructor(
        @Inject(Symbols.Rent) private rent: typeof Rent,
        @Inject(Symbols.Room) private room: typeof Room,
        @Inject(Symbols.Hotel) private hotel: typeof Hotel,
        @Inject(Symbols.Image) private image: typeof Image,
        @Inject(Symbols.User) private user: typeof User,
    ) {
    }

    public async createRent(userId: number, rent: IRent) {
        const newRent = new this.rent({
            userId,
            ...rent,
        });
        try {
            await newRent.save();
        } catch (err) {
            console.log(err);
        }
    }

    public async getTickets(userId: number) {
        return await this.rent.findAll({
            where: {userId}, include: [this.user, {
                model: this.room,
                include: [{
                    model: this.hotel,
                    include: [this.image],
                }],
            }],
        });
    }
}
