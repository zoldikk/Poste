export default function handler(req, res) {
    const { id, lop, code } = req.query;

    // التحقق من أن `id` و `lop` و `code` قد تم تمريرهم في الرابط
    if (!id || !lop || !code) {
        return res.status(400).send("Both 'id', 'lop', and 'code' parameters are required");
    }

    // تحقق من صحة `code`
    if (code !== 'FAD2025DR') {
        return res.status(403).send("Unauthorized access");
    }

    // Function to convert hex string to text
    function hexToText(hexString) {
        const bytes = Buffer.from(hexString, 'hex');
        return bytes.toString('latin1');
    }

    // Function to shorten URL using is.gd
    async function shortenUrl(longUrl) {
        const response = await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(longUrl));
        const data = await response.json();
        return data.shorturl; // إرجاع الرابط المختصر
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
        console.error("Error during processing:", err); // تسجيل الأخطاء
        res.status(500).send("An error occurred while processing the request.");
    });
                                              }
