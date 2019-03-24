import { Hotel, Room, Rent, Image } from './models';
import { Symbols } from '../symbols';

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
    {
        provide: Symbols.Image,
        useValue: Image,
    },
];
