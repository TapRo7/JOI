const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encryptToken(token, webhookId) {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    cipher.setAAD(Buffer.from(`${webhookId}`));

    const encrypted = Buffer.concat([
        cipher.update(token, 'utf8'),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
        tag: tag.toString('hex')
    };
}

function decryptToken(payload, webhookId) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        KEY,
        Buffer.from(payload.iv, 'hex')
    );

    decipher.setAAD(Buffer.from(`${webhookId}`));
    decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(payload.content, 'hex')),
        decipher.final()
    ]);

    return decrypted.toString('utf8');
}

module.exports = { encryptToken, decryptToken };