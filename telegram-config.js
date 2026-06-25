// Telegram Bot orqali admin'larga bildirishnoma yuborish konfiguratsiyasi
// Bot: @barber_honasi_bot

const TELEGRAM_CONFIG = {
    botToken: '8861737250:AAHkkclKYs7tR-EGrMUV4BJz3Buyd21FP0U',
    // Admin bildirishnomalari shu ro'yxatdagi HAR BIR chat ID'ga yuboriladi
    adminChatIds: ['5776778620', '2144412872']
};

/**
 * Telegram orqali xabar yuboradi.
 * @param {string} message - yuboriladigan matn
 * @param {string} [customChatId] - berilsa, faqat shu chat ID'ga yuboradi (masalan, oddiy mijozga tasdiq xabari).
 *   Berilmasa, ADMIN_CHAT_IDS ro'yxatidagi barcha admin'larga yuboriladi.
 * Xato bo'lsa ham (internet yo'q, token noto'g'ri va h.k.) ilovani to'xtatib qo'ymaydi —
 * faqat console'ga yozadi, chunki bildirishnoma bron qilishning o'zini bloklamasligi kerak.
 */
async function sendTelegramNotification(message, customChatId) {
    const targets = customChatId ? [customChatId] : TELEGRAM_CONFIG.adminChatIds;

    for (const chatId of targets) {
        try {
            const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const data = await response.json();
            if (!data.ok) {
                console.error(`Telegram xabar yuborilmadi (chatId: ${chatId}):`, data.description);
            } else {
                console.log(`✓ Telegram bildirishnoma yuborildi (chatId: ${chatId})`);
            }
        } catch (error) {
            console.error(`Telegram xabar yuborishda xato (chatId: ${chatId}):`, error);
        }
    }
}

window.sendTelegramNotification = sendTelegramNotification;