import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { lop } = req.query;

    if (!lop) {
        return res.status(400).send('Missing `lop` query parameter');
    }

    // Function to shorten URL
    async function shortenUrl(longUrl) {
        const apiUrl = 'https://cleanuri.com/api/v1/shorten';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({ url: longUrl }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            return data.result_url;
        } catch (error) {
            console.error('Error shortening URL:', error);
            return null;
        }
    }

    // Function to decode hex to text
    function dec(hexString) {
        const bytes = Buffer.from(hexString, 'hex');
        return bytes.toString('latin1');
    }

    // Function to process information
    async function info(lop) {
        const phones = ['iPhone', 'Samsung', 'redmi', 'OnePlus', 'Sony', 'Huawei'];
        const phone = phones[Math.floor(Math.random() * phones.length)];
        const longText = dec(lop);
        const id = 'في فريق';

        if (longText.includes('google')) {
            const link = longText.substring(longText.indexOf('https'), longText.indexOf(''));
            const shortUrl = await shortenUrl(link);
            return `[b][c]~ المحاكمة:\n[00ffff]حالة لاعب: ${id}\nهاتف لاعب: ${phone}\nربط اساسي: Google\nصورة لاعب: [00ff00]${shortUrl || link}`;
        }

        if (longText.includes('facebook')) {
            const link = longText.substring(longText.indexOf('https'), longText.indexOf(''));
            const shortUrl = await shortenUrl(link);
            return `[b][c]~ المحاكمة:\n[00ffff]حالة لاعب: ${id}\nهاتف لاعب: ${phone}\nربط اساسي: Facebook\nصورة لاعب: [00ff00]${shortUrl || link}`;
        }

        return 'No Google or Facebook link found.';
    }

    try {
        const result = await info(lop);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
}
