// File: lib/Utils/Converter.js
// Module: Chatify Framework

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { getRandom } = require('./Function');

/**
 * Convert Audio/Video to FFMPEG Supported Format
 * @param {Buffer} buffer 
 * @param {String} ext 
 */
function ffmpegConvert(buffer, args = [], ext = '', ext2 = '') {
    return new Promise(async (resolve, reject) => {
        try {
            let tmp = path.join(__dirname, `../../temp/${getRandom(ext)}`);
            let out = tmp + '.' + ext2;
            
            // Pastikan folder temp ada
            if (!fs.existsSync(path.join(__dirname, '../../temp'))) fs.mkdirSync(path.join(__dirname, '../../temp'));

            await fs.promises.writeFile(tmp, buffer);
            
            ffmpeg(tmp)
                .outputOptions(args)
                .on('end', async () => {
                    const data = await fs.promises.readFile(out);
                    await fs.promises.unlink(tmp);
                    await fs.promises.unlink(out);
                    resolve(data);
                })
                .on('error', async (err) => {
                    if (fs.existsSync(tmp)) await fs.promises.unlink(tmp);
                    if (fs.existsSync(out)) await fs.promises.unlink(out);
                    reject(err);
                })
                .save(out);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Convert Image/Video to WebP (Sticker)
 */
function toSticker(buffer, ext) {
    return ffmpegConvert(buffer, [
        '-vcodec', 'libwebp',
        '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'
    ], ext, 'webp');
}

/**
 * Convert Audio to MP3
 */
function toAudio(buffer, ext) {
    return ffmpegConvert(buffer, [
        '-vn',
        '-ac', '2',
        '-b:a', '128k',
        '-ar', '44100',
        '-f', 'mp3'
    ], ext, 'mp3');
}

/**
 * Convert Audio to PTT (Voice Note WhatsApp)
 */
function toPTT(buffer, ext) {
    return ffmpegConvert(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
        '-compression_level', '10'
    ], ext, 'opus');
}

module.exports = {
    toSticker,
    toAudio,
    toPTT
};