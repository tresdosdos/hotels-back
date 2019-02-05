import { Hotel, Floor, Room } from './models';
import { Symbols } from '../symbols';

export const hotelProviders = [
    {
        provide: Symbols.Hotel,
        useValue: Hotel,
    },
    {
        provide: Symbols.Floor,
        useValue: Floor,
    },
    {
        provide: Symbols.Room,
        useValue: Room,
    },
];
