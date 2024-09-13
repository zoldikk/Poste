export default function handler(req, res) {
    const { id, lop } = req.query;

    // التحقق من أن `id` و `lop` قد تم تمريرهما في الرابط
    if (!id || !lop) {
        return res.status(400).send("Both 'id' and 'lop' parameters are required");
    }

    // Function to convert hex string to text
    function hexToText(hexString) {
        const bytes = Buffer.from(hexString, 'hex');
        return bytes.toString('latin1');
    }

    // Function to shorten URL using an external API
    async function shortenUrl(longUrl) {
        const response = await fetch('https://cleanuri.com/api/v1/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ url: longUrl })
        });
        const data = await response.json();
        return data.result_url;
    }

    // Function to process the lop and return the formatted message
    async function processLop(id, lop) {
        const phones = ["iPhone", "Samsung", "redmi", "OnePlus", "Sony", "Huawei"];
        const randomPhone = phones[Math.floor(Math.random() * phones.length)];

        const longText = hexToText(lop);

        let resultMessage = `[b][c]~ المحاكمة:\n[00ffff]وضع لاعب: ${id}\nهاتف لاعب: ${randomPhone}\n`;

        if (longText.includes('google')) {
            const linkStart = longText.indexOf('https');
            const linkEnd = longText.indexOf('\x10\x01\x18', linkStart);
            const link = longText.substring(linkStart, linkEnd);
            const shortUrl = await shortenUrl(link);
            resultMessage += `ربط اساسي: Google\nصورة لاعب: [00ff00]${shortUrl}`;
        } else if (longText.includes('facebook')) {
            const linkStart = longText.indexOf('https');
            const linkEnd = longText.indexOf('\x10\x01\x18', linkStart);
            const link = longText.substring(linkStart, linkEnd);
            const shortUrl = await shortenUrl(link);
            resultMessage += `ربط اساسي: Facebook\nصورة لاعب: [00ff00]${shortUrl}`;
        }

        return resultMessage;
    }

    // معالجة lop وإرجاع النتيجة النهائية
    processLop(id, lop).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send("An error occurred while processing the request.");
    });
        }
