import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Symbols} from '../symbols';
import {Rent, Room} from '../db/models';
import {IRoom} from './interfaces';

@Injectable()
export class RoomService {
    constructor(
        @Inject(Symbols.Room) private room: typeof Room,
        @Inject(Symbols.Rent) private rent: typeof Rent,
    ) {}

    public async getById(id: number): Promise<IRoom> {
        const room = await this.room.findOne({where: {id}, include: [this.rent]});

        if (!room) {
            throw new BadRequestException('Room doesn\'t exists');
        }

        return room.toJSON();
    }

    public async list(hotelId: number): Promise<IRoom[]> {
        return await this.room.findAll({where: {hotelId}, include: [this.rent]});
    }

    public async create(room: IRoom): Promise<void> {
        const newRoom = new this.room(room);

        try {
            const savedRoom = await newRoom.save();

            return savedRoom.toJSON();
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Room with such number already exists');
            }
        }
    }

    public async update(room: IRoom): Promise<IRoom> {
        return {} as IRoom;
    }

    public async delete(id: number): Promise<void> {
        await this.room.destroy({where: {id}});
    }
}
