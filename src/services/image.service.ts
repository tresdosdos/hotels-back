import {Inject, Injectable} from '@nestjs/common';
import {Symbols} from '../symbols';
import Image from '../db/models/image.model';

interface IImageForeignKeys {
    userId?: number;
    hotelId?: number;
    roomId?: number;
}

@Injectable()
export class ImageService {
    constructor(@Inject(Symbols.Image) private image: typeof Image) {}

    public async save(destination: IImageForeignKeys, url: string): Promise<Image> {
        const image = new this.image({
            url,
            shortUrl: this.makeHDImage(url),
            ...destination,
        });
        return await image.save();
    }

    public async delete(id: number): Promise<void> {
        await this.image.destroy({where: {id}});
    }

    private makeHDImage(url: string): string {
        return url.slice(0, url.indexOf('upload/') + 7) + 'w_1280,h_720/' + url.slice(url.indexOf('upload/') + 7);
    }
}
