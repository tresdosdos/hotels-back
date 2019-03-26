import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Symbols} from '../symbols';
import {Hotel, Image, Room} from '../db/models';
import {IHotel} from './interfaces';
import {HotelExistsError} from '../utils/errors';

@Injectable()
export class HotelService {
    constructor(
        @Inject(Symbols.Hotel) private hotel: typeof Hotel,
        @Inject(Symbols.Room) private room: typeof Room,
        @Inject(Symbols.Image) private image: typeof Image,
    ) {}

    public async getById(id: number): Promise<IHotel> {
        const hotel = await this.hotel.findOne({where: {id}, include: [this.room, this.image]});

        if (!hotel) {
            throw new HotelExistsError();
        }

        return hotel.toJSON();
    }

    public async list(userId: number): Promise<IHotel[]> {
        return await this.hotel.findAll({where: {userId}, include: [this.image]});
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
        return {} as IHotel;
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
}
