import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Metadata, ResizeOptions, Sharp} from "sharp";

export type UploadFile = (key: string, buffer: Buffer, contentType: string) => Promise<string>;

let uploadFile: UploadFile | undefined;

export function getUploadFile(): UploadFile {
    if (uploadFile) return uploadFile;

    const bucket = readR2Setting("R2_BUCKET_NAME");
    const publicOrigin = readR2Origin("R2_PUBLIC_BASE_URL");
    const r2 = new S3Client({
        endpoint: readR2Origin("R2_ENDPOINT"),
        region: "auto",
        forcePathStyle: true,
        credentials: {
            accessKeyId: readR2Setting("R2_ACCESS_KEY_ID"),
            secretAccessKey: readR2Setting("R2_SECRET_ACCESS_KEY"),
        },
        // R2 does not support the SDK's default CRC32 full-object checksum.
        requestChecksumCalculation: "WHEN_REQUIRED",
        maxAttempts: 5,
    });

    uploadFile = async (key, buffer, contentType) => {
        await r2.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));

        const encodedKey = key.split("/").map(encodeURIComponent).join("/");
        const url = `${publicOrigin}/${encodedKey}`;
        console.log(`Uploaded to ${url}`);
        return url;
    };

    return uploadFile;
}

function readR2Setting(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`Missing ${name} in api/.env`);
    return value;
}

function readR2Origin(name: string): string {
    const value = readR2Setting(name);
    const url = URL.canParse(value) ? new URL(value) : undefined;
    if (!url || !["http:", "https:"].includes(url.protocol) ||
        url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
        throw new Error(`${name} must be an HTTP(S) origin in api/.env`);
    }
    return url.origin;
}

export async function compressImageBuffer(sharpImage: Sharp, resizeSettings: ResizeOptions, maxFileSize: number): Promise<[Buffer, number, Metadata]> {
    let fileSize;
    let compressedImageBuffer;
    let quality = 100;
    const compressedWebp = sharpImage
        .resize(resizeSettings);
    do {
        compressedImageBuffer = await compressedWebp.webp({quality: quality}).toBuffer({resolveWithObject: true});
        fileSize = compressedImageBuffer.info.size;
        // Compress to 1mb or less
        if (fileSize > maxFileSize) {
            quality -= 5;
        } else {
            break;
        }
    } while (quality > 0);
    return [compressedImageBuffer.data, quality, await compressedWebp.metadata()];
}

export function getUploadMessage(uploadType: string, imageName: string, resultSize: number, quality: number, originalSize: number) {
    return `Uploading ${uploadType} version of ${imageName} with quality ${quality} a size of ${(resultSize / 1000).toFixed(2)} KB (${(resultSize / originalSize * 100).toFixed(2)}%)`;
}
