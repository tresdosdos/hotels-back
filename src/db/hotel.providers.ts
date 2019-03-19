import { Hotel, Room } from './models';
import { Symbols } from '../symbols';
import Rent from './models/rent.model';

export const hotelProviders = [
    {
        provide: Symbols.Hotel,
        useValue: Hotel,
    },
    {
        provide: Symbols.Room,
        useValue: Room,
    },
    {
        provide: Symbols.Rent,
        useValue: Rent,
    },
];
