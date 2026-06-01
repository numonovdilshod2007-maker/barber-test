# 💇 Sartorosh Honasi - Barber Shop Website

Bunga sartorosh honasi uchun web-sayt - booking sistema, foydalanuvchi profili va admin paneli bilan.

## 🚀 Qanday Ishlatish

### Ishga Tushirish
1. `index.html` faylini brauzer oching
2. Yoki papkada Python server ishga tushiring:
```bash
cd "/Users/dilshodnumonov/Desktop/barber shop"
python3 -m http.server 8000
```
3. Brauzerda `http://localhost:8000` ga kiring

## 👤 Test Accountlari

### Admin Account (Admin Panel uchun)
- **Email:** admin@barber.com
- **Parol:** admin123

### Yangi Account
- Istalgan email va parol bilan ro'yxatdan o'ting

## ✨ Asosiy Xususiyatlar

### 📅 1. Bronilashtirish Tizimi
- ✓ Xizmat tanlash (Tuzoq, Saqqal, Soch bo'yash, va hokazo)
- ✓ Sartorosh tanlash (4 ta sartorosh mavjud)
- ✓ Kalendardan sana tanlash
- ✓ Bo'sh vaqtlarni ko'rish
- ✓ Bronilashtirish tasdiqlash

### 📋 2. Mening Bronilashtirmalarim
- Barcha bronilashtirmalaringizni ko'rish
- Holat tekshirish (Tasdiqlangan, Kutayotgan, Bekor qilingan)
- Bronilashtirmani bekor qilish

### ⭐ 3. Sharhlar Tizimi
- Sartorosh haqida sharh qoldirish
- 1-5 reyting berish
- Sartorosh reyting avtomatik yangilanishi

### 👨‍💼 4. Sartoroshlar Va Xizmatlar
- Barcha sartoroshlarni ko'rish (profil, reyting, holati)
- Barcha xizmatlarni ko'rish (narx, davomiyligi)

### ⚙️ 5. Admin Panel
- Yangi xizmat qo'shish
- Yangi sartorosh qo'shish
- Bronilashtirmalarni boshqarish va holati o'zgartirish

## 📁 Fayl Tuzilishi

```
barber shop/
├── index.html       # Asosiy HTML fayl
├── app.js          # Vue.js ilovasi va mantikasi
├── styles.css      # Barcha stillar
└── README.md       # Bu fayl
```

## 💾 Ma'lumotlar Saqlash

- Barcha ma'lumotlar `localStorage` da saqlanadi
- Brauzer o'chganda ham ma'lumotlar saqlanib qoladi
- `localStorage` o'chirish: DevTools → Application → Local Storage → o'chirish

## 🎨 Ranglar va Dizayn

- Asosiy rang: Purple (#667eea)
- Tuproq rang: Gray (#f0f0f0)
- Muaffaqiyat: Green (#27ae60)
- Xato: Red (#e74c3c)

## 🛠️ Texnologiyalar

- **Vue.js 3** - Frontend framework
- **HTML5** - Tuzilma
- **CSS3** - Stil va responsive dizayn
- **LocalStorage** - Ma'lumotlar saqlash

## 📱 Responsive Dizayn

- Desktop va mobile uchun optimallashtirgan
- Tablet uchun ham yaxshi ishlaydi

## 🔐 Xavfsizlik (Demo)

Bu demo versiya - production uchun:
- Parollarni hash qilish kerak
- HTTPS ishlating
- Backend authentication qo'shish kerak
- Database (MongoDB, PostgreSQL) qo'shish kerak

## 🎯 Qo'shimcha Xususiyatlar Ideyalari

1. **SMS/Email Bildirishnomalar** - Bronilashtirish vaqtidan 1 soat oldin
2. **To'lov Tizimi** - Payme, Click, Apelsin
3. **Geo-Location** - Koordinatalar orqali joyni tanlash
4. **Chat Support** - Foydalanuvchilar bilan to'g'ridan-to'g'ri aloqa
5. **Statistika Dashboard** - Admin uchun daromad va vaqt statistikasi
6. **Multi-language Support** - O'zbek, Rus, English
7. **Mobile App** - React Native yoki Flutter

## 📞 Yordam

Savollar bo'lsa, email yuboring yoki issue ochting!

---

**Yaratilgan:** 2026-yil May 28
**Versiya:** 1.0
