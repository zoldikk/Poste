import fetch from 'node-fetch';

// Function to shorten URLs
async function shortenUrl(longUrl) {
    const apiUrl = 'https://cleanuri.com/api/v1/shorten';
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: new URLSearchParams({ url: longUrl }),
    });
    if (response.ok) {
        const data = await response.json();
        return data.result_url;
    } else {
        return null;
    }
}

// Function to decode hex string
function dec(hexString) {
    let str = '';
    for (let i = 0; i < hexString.length; i += 2) {
        str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
    }
    return str;
}

// API handler
export default async function handler(req, res) {
    const { lop } = req.query;

    if (!lop) {
        return res.status(400).json({ error: "Parameter 'lop' is required" });
    }

    const phones = ["iPhone", "Samsung", "redmi", "OnePlus", "Sony", "Huawei"];
    const phone = phones[Math.floor(Math.random() * phones.length)];
    const longText = dec(lop);
    const id = "في فريق";

    let responseText = '';

    if (longText.includes('google')) {
        const startLink = longText.indexOf('https');
        const endLink = longText.indexOf('', startLink);
        const link = longText.substring(startLink, endLink);
        const shortUrl = await shortenUrl(link);
        responseText = `[b][c]~ المحاكمة:\n[00ffff]حالة لاعب: ${id}\nهاتف لاعب: ${phone}\nربط اساسي: Google\nصورة لاعب: [00ff00]${shortUrl}`;
    }

    if (longText.includes('facebook')) {
        const startLink = longText.indexOf('https');
        const endLink = longText.indexOf('', startLink);
        const link = longText.substring(startLink, endLink);
        const shortUrl = await shortenUrl(link);
        responseText = `[b][c]~ المحاكمة:\n[00ffff]حالة لاعب: ${id}\nهاتف لاعب: ${phone}\nربط اساسي: Facebook\nصورة لاعب: [00ff00]${shortUrl}`;
    }

    res.status(200).send(responseText);
}
