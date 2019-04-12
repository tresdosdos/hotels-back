import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Symbols } from '../symbols';
import { Hotel, Image, Rent, Room, User } from '../db/models';
import { IHotel } from './interfaces';
import { HotelExistsError } from '../utils/errors';

@Injectable()
export class HotelService {
    constructor(
        @Inject(Symbols.Hotel) private hotel: typeof Hotel,
        @Inject(Symbols.Room) private room: typeof Room,
        @Inject(Symbols.Rent) private rent: typeof Rent,
        @Inject(Symbols.Image) private image: typeof Image,
        @Inject(Symbols.User) private user: typeof User,
    ) {}

    public async getById(id: number): Promise<IHotel> {
        const hotel = await this.hotel.findOne({where: {id}, include: [this.image, {
            model: this.room,
                include: [this.user],
            }]});

        if (!hotel) {
            throw new HotelExistsError();
        }

        return hotel.toJSON();
    }

    public async list(userId: number): Promise<IHotel[]> {
        return await this.hotel.findAll({where: {userId}, include: [this.image, this.room]});
    }

    public async create(hotel: IHotel, userId: number): Promise<void> {
        const newHotel = new this.hotel({...hotel, userId});
        try {
            const savedHotel = await newHotel.save();

            return savedHotel.toJSON();
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Hotel with such name already exists');
            }
        }
    }

    public async update(hotel: IHotel): Promise<IHotel> {
        const foundHotel = await this.hotel.findOne({where: {id: hotel.id}});

        if (!foundHotel) {
            throw new NotFoundException('There isn\'t such hotel');
        }

        await foundHotel.update(hotel);

        return foundHotel.toJSON();
    }

    public async delete(id: number): Promise<void> {
        await this.hotel.destroy({where: {id}});
    }

    public async getCities(): Promise<string[]> {
        const hotels = await this.hotel.findAll();

        return hotels.map((hotel: Hotel) => {
            hotel = hotel.toJSON();

            return hotel.city;
        });
    }

    public async uploadPhoto(id: number, url?: string) {
        const image = new Image({
            url,
            shortUrl: url,
            hotelId: id,
        });
        await image.save();

        const hotel = this.hotel.findOne({where: {id}, include: [this.image, {
                model: this.room,
                include: [this.user],
            }]});

        return hotel.toJSON();
    }
}
