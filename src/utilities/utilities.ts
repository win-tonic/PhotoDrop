import { url } from "inspector";
import { PhotoType } from "../db/db";

export function generateOTP(): string {
    var chars = "0123456789";
    var string_length = 6;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars[rnum];
    }
    return randomstring;
}

export function unwatermarkPhotos(photos: PhotoType[], mode: 'force' | 'paidOnly'): PhotoType[] {
    if (mode === 'force') {
        return photos.map(photo => {
            return {
                ...photo,
                url: photo.url.replace('photos/watermarked/', 'photos/original/')
            };
        });
    } else {
        return photos.map(photo => {
            if (photo.paid) {
                return {
                    ...photo,
                    url: photo.url.replace('photos/watermarked/', 'photos/original/')
                };
            }
            return { ...photo };
        });
    }
}

// async function test(){
//     const photosDummyData = [
//         {url: 'photos/watermarked/1.jpg', paid: 1, clients: '["+1234567890"]', albumId: 1, id: 1},
//         {url: 'photos/watermarked/2.jpg', paid: 0, clients: '["+1234567890"]', albumId: 1, id: 2},
//         {url: 'photos/watermarked/3.jpg', paid: 1, clients: '["+1234567890"]', albumId: 1, id: 3},
//         {url: 'photos/watermarked/4.jpg', paid: 0, clients: '["+1234567890"]', albumId: 1, id: 4}
//     ]
//     console.log(unwatermarkPhotos(photosDummyData, 'force'))
//     console.log(unwatermarkPhotos(photosDummyData, 'paidOnly'))
// }

// test()