// Telegram Bot orqali admin'ga bildirishnoma yuborish konfiguratsiyasi
// Bot: @barber_honasi_bot

const TELEGRAM_CONFIG = {
    botToken: '8861737250:AAHkkclKYs7tR-EGrMUV4BJz3Buyd21FP0U',
    chatId: '5776778620'
};

/**
 * Telegram orqali admin'ga xabar yuboradi.
 * Xato bo'lsa ham (internet yo'q, token noto'g'ri va h.k.) ilovani to'xtatib qo'ymaydi —
 * faqat console'ga yozadi, chunki bildirishnoma bron qilishning o'zini bloklamasligi kerak.
 */
/**
 * Telegram orqali xabar yuboradi.
 * @param {string} message - yuboriladigan matn
 * @param {string} [customChatId] - berilmasa, admin'ning chat ID'siga yuboradi
 * Xato bo'lsa ham (internet yo'q, token noto'g'ri va h.k.) ilovani to'xtatib qo'ymaydi —
 * faqat console'ga yozadi, chunki bildirishnoma bron qilishning o'zini bloklamasligi kerak.
 */
async function sendTelegramNotification(message, customChatId) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: customChatId || TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (!data.ok) {
            console.error('Telegram xabar yuborilmadi:', data.description);
        } else {
            console.log('✓ Telegram bildirishnoma yuborildi');
        }
    } catch (error) {
        console.error('Telegram xabar yuborishda xato:', error);
    }
}

window.sendTelegramNotification = sendTelegramNotification;