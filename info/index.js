const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// دالة لتقصير الروابط
async function shortenUrl(longUrl) {
    const apiUrl = 'https://cleanuri.com/api/v1/shorten';
    try {
        const response = await axios.post(apiUrl, new URLSearchParams({ url: longUrl }));
        return response.data.result_url;
    } catch (error) {
        console.error('Error shortening URL:', error);
        return null;
    }
}

// دالة لتحويل hex إلى نص
function dec(hexString) {
    return Buffer.from(hexString, 'hex').toString('latin1');
}

// دالة للتعامل مع البيانات الواردة
app.post('/info', async (req, res) => {
    const { lop } = req.body;
    const phones = ["iPhone", "Samsung", "redmi", "OnePlus", "Sony", "Huawei"];
    const phone = phones[Math.floor(Math.random() * phones.length)];
    const longText = dec(lop);
    const id = "في فريق";

    let results = [];

    if (longText.includes('google')) {
        const link = extractLink(longText);
        const shortUrl = await shortenUrl(link);
        results.push({
            player_status: id,
            player_phone: phone,
            link_type: "Google",
            short_url: shortUrl
        });
    }

    if (longText.includes('facebook')) {
        const link = extractLink(longText);
        const shortUrl = await shortenUrl(link);
        results.push({
            player_status: id,
            player_phone: phone,
            link_type: "Facebook",
            short_url: shortUrl
        });
    }

    res.json(results);
});

// دالة لاستخراج الرابط
function extractLink(text) {
    const ap = 'https';
    const dp = '';
    const startLink = text.indexOf(ap);
    const endLink = text.indexOf(dp, startLink);
    return text.substring(startLink, endLink);
}

// بدء الخادم
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
