console.log('app-v3.js loaded');
console.log('app-v3.js sees FIREBASE_CONFIG.apiKey =', typeof FIREBASE_CONFIG !== 'undefined' ? FIREBASE_CONFIG.apiKey : 'undefined');
const { createApp } = Vue;

const ADMIN_EMAILS = ['dnumonov49@gmail.com'];

const app = createApp({
    template: `
        <div class="container">
            <!-- Loading Screen -->
            <div v-if="isLoading" style="text-align: center; padding: 100px;">
                <div class="spinner"></div>
                <p style="color: var(--ivory-faint); margin-top: 20px;">Yuklanmoqda...</p>
            </div>

            <!-- Auth Page -->
            <div v-if="!currentUser && !isLoading" class="auth-page">
                <div class="auth-form">
                    <h2>{{ isLogin ? "Kirish" : "Ro'yxatdan o'tish" }}</h2>

                    <div v-if="authError" class="alert alert-error">{{ authError }}</div>

                    <button class="btn btn-primary" @click="signInWithGoogle" style="width: 100%; padding: 12px; background: #4285f4;">
                        🔐 Google bilan kirish
                    </button>

                    <div style="text-align: center; color: var(--ivory-faint); margin: 20px 0;">yoki</div>

                    <div class="form-group">
                        <label>Ism Familiya</label>
                        <input v-model="authForm.fullName" type="text" placeholder="Ismingizni kiriting">
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input v-model="authForm.email" type="email" placeholder="Email kiriting">
                    </div>

                    <div class="form-group">
                        <label>Parol</label>
                        <input v-model="authForm.password" type="password" placeholder="Parol kiriting">
                    </div>

                    <div v-if="!isLogin" class="form-group">
                        <label>Telefon</label>
                        <input v-model="authForm.phone" type="tel" placeholder="+998 XX XXX XX XX">
                    </div>

                    <button class="btn btn-primary" @click="authenticate" style="margin-top: 10px; width: 100%; padding: 12px;">
                        {{ isLogin ? "Kirish" : "Ro'yxatdan o'tish" }}
                    </button>

                    <div class="auth-toggle" style="margin-top: 20px;">
                        <span>{{ isLogin ? "Accounti yo'qmi? " : "Accounti bor mi? " }}</span>
                        <button @click="toggleAuthMode">{{ isLogin ? "Ro'yxatdan o'tish" : "Kirish" }}</button>
                    </div>
                </div>
            </div>

            <!-- Dashboard -->
            <div v-if="currentUser && !isLoading">
                <div class="header">
                    <div class="logo">💇 Sartorosh Honasi</div>
                    <div class="user-info">
                        <span>Xush kelibsiz, {{ currentUser.fullName || currentUser.displayName }}!</span>
                        <button class="btn btn-secondary" @click="logout">Chiqish</button>
                    </div>
                </div>

                <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
                <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

                <div class="mobile-menu">
                    <div class="mobile-menu-icons">
                        <button
                            v-for="menu in mobileMenus"
                            :key="menu.id"
                            class="mobile-menu-icon"
                            :class="{ selected: mobileMenuSelected === menu.id }"
                            @click="selectMobileMenu(menu.id)"
                        >
                            <span class="icon">{{ menu.icon }}</span>
                            <span class="label">{{ menu.label }}</span>
                        </button>
                    </div>

                    <div v-if="mobileMenuSelected" class="mobile-menu-panel">
                        <div class="mobile-panel-header">
                            {{ getTabLabel(mobileMenuSelected) }} uchun tanlang
                        </div>
                        <div class="mobile-menu-actions">
                            <button
                                v-for="action in mobileMenuActions"
                                :key="action.id"
                                class="btn btn-secondary mobile-menu-action"
                                @click="openMobileMenuAction(action.id)"
                            >
                                {{ action.name }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="tabs">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab"
                        class="tab-btn"
                        :class="{ active: activeTab === tab }"
                        @click="activeTab = tab"
                    >
                        {{ getTabLabel(tab) }}
                    </button>
                </div>

                <div v-if="activeTab === 'booking'" class="dashboard">
                    <div class="alert alert-info">
                        📅 Quyidagi bosqichlarni amalga oshiring: 1) Xizmatni tanlang 2) Sartoroshni tanlang 3) Vaqtni tanlang 4) Bronilashtiring
                    </div>
                    <div class="alert alert-info" style="background: rgba(56, 189, 248, 0.12); color: #7dd3fc; border-color: rgba(56, 189, 248, 0.3);">
                        🛋️ Hozir xonada <strong>{{ barbers.length }}</strong> sartorosh bor: <strong>Sardor</strong> va <strong>Doston</strong>.
                    </div>

                    <div>
                        <h3 style="margin-bottom: 15px; color: var(--ivory);">1️⃣ Xizmatni tanlang</h3>
                        <div v-if="services.length === 0" style="color: var(--ivory-faint);">Xizmatlar yuklanmoqda...</div>
                        <div v-else class="services-grid">
                            <div 
                                v-for="service in services" 
                                :key="service.id"
                                class="service-card"
                                :class="{ selected: selectedService?.id === service.id }"
                                @click="selectedService = service"
                            >
                                <div class="service-name">{{ service.name }}</div>
                                <div class="service-price">{{ service.price.toLocaleString() }} so'm</div>
                                <div class="service-duration">⏱️ {{ service.duration }} min</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 30px;">
                        <h3 style="margin-bottom: 15px; color: var(--ivory);">2️⃣ Sartoroshni tanlang</h3>
                        <div v-if="barbers.length === 0" style="color: var(--ivory-faint);">Sartoroshlar yuklanmoqda...</div>
                        <div v-else class="barbers-grid">
                            <div 
                                v-for="barber in barbers" 
                                :key="barber.id"
                                class="barber-card"
                                :class="{ selected: selectedBarber?.id === barber.id }"
                                @click="selectedBarber = barber"
                            >
                                <div class="barber-avatar">{{ barber.avatar }}</div>
                                <div class="barber-name">{{ barber.name }}</div>
                                <div class="barber-rating">⭐ {{ barber.rating }}/5</div>
                                <div class="barber-status" :class="{ busy: barber.available === false }">
                                    {{ barber.available ? "Bo'sh" : "Band" }}
                                </div>
                                <div class="barber-count">{{ bookingCountForBarber(barber.id) }} ta bron</div>
                            </div>
                        </div>
                    </div>

                    <div class="live-queue" style="margin-top: 30px; padding: 20px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-subtle);">
                        <h3 style="margin-bottom: 15px; color: var(--ivory);">👥 Jonli bronlar</h3>
                        <div v-if="liveQueue.length === 0" style="color: var(--ivory-faint);">Hozir hech qanday jonli bron yo'q.</div>
                        <div v-else class="queue-list">
                            <div v-for="booking in liveQueue" :key="booking.id" class="queue-item" style="padding: 12px; border-bottom: 1px solid var(--border-subtle);">
                                <strong>{{ booking.userName }}</strong> — {{ booking.serviceName }}
                                <div style="font-size: 13px; color: var(--ivory-dim);">{{ booking.barberName }} | {{ formatDate(booking.date) }} {{ booking.time }} | {{ getStatusLabel(booking.status) }}</div>
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedService && selectedBarber" class="booking-section" style="margin-top: 30px;">
                        <div class="calendar-section">
                            <div class="section-title">3️⃣ Sanani tanlang</div>
                            <div class="calendar-header">
                                <button @click="previousMonth">◀</button>
                                <span>{{ currentMonthName }}</span>
                                <button @click="nextMonth">▶</button>
                            </div>
                            <div class="calendar-grid">
                                <div 
                                    v-for="(day, index) in calendarDays" 
                                    :key="index"
                                    class="calendar-day"
                                    :class="{ 
                                        'other-month': !day.currentMonth,
                                        'selected': selectedDate === day.dateStr,
                                        'today': day.isToday
                                    }"
                                    @click="selectDate(day)"
                                >
                                    {{ day.date }}
                                </div>
                            </div>
                        </div>

                        <div class="time-slots-section">
                            <div class="section-title">4️⃣ Vaqtni tanlang</div>
                            <div v-if="selectedDate" class="time-slots">
                                <div 
                                    v-for="time in availableTimeSlots" 
                                    :key="time"
                                    class="time-slot"
                                    :class="{ 
                                        'selected': selectedTime === time,
                                        'disabled': !isTimeAvailable(time)
                                    }"
                                    @click="isTimeAvailable(time) && (selectedTime = time)"
                                >
                                    {{ time }}
                                </div>
                            </div>
                            <div v-else style="color: var(--ivory-faint); text-align: center; padding: 20px;">
                                Iltimos, avval sanani tanlang
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedService && selectedBarber && selectedDate && selectedTime" style="background: var(--bg-card); padding: 20px; border-radius: 16px; border: 1px solid var(--border-subtle); margin-top: 20px;">
                        <h3 style="margin-bottom: 15px; color: var(--ivory);">📋 Bronilashtirish Tafsillari</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                            <div><strong>Xizmat:</strong> {{ selectedService.name }}</div>
                            <div><strong>Narxi:</strong> {{ selectedService.price.toLocaleString() }} so'm</div>
                            <div><strong>Sartorosh:</strong> {{ selectedBarber.name }}</div>
                            <div><strong>Sana & Vaqt:</strong> {{ formatDate(selectedDate) }} {{ selectedTime }}</div>
                        </div>
                        <button class="btn btn-success" @click="confirmBooking" style="width: 100%; padding: 15px;">
                            ✓ Bronilashtirish
                        </button>
                    </div>
                </div>

                <div v-if="activeTab === 'myBookings'" class="dashboard">
                    <div class="card" style="margin-bottom: 20px; padding: 16px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 16px;">
                        <div v-if="!currentUser.telegramChatId">
                            <p style="margin: 0 0 8px; font-weight: 600;">🔔 Bron tasdiqlarini Telegram'da olish</p>
                            <p style="margin: 0 0 10px; font-size: 13px; color: var(--ivory-faint);">
                                1) Telegram'da <a href="https://t.me/userinfobot" target="_blank">@userinfobot</a> ni oching va <b>/start</b> bosing — u sizning Chat ID'ingizni yuboradi.<br>
                                2) Chat ID raqamini nusxalab, pastga kiriting va saqlang.<br>
                                3) Keyin <a href="https://t.me/barber_honasi_bot" target="_blank">@barber_honasi_bot</a> ga o'tib, <b>/start</b> bosing (xabarlar shu yerga keladi).
                            </p>
                            <div style="display: flex; gap: 8px;">
                                <input v-model="telegramChatIdInput" type="text" placeholder="Masalan: 5776778620" style="flex: 1;">
                                <button class="btn btn-primary" @click="saveTelegramChatId" style="white-space: nowrap;">Saqlash</button>
                            </div>
                        </div>
                        <div v-else style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: var(--success);">✓ Telegram bildirishnomalari ulangan</span>
                            <button class="btn btn-secondary" @click="unlinkTelegramChatId" style="font-size: 12px; padding: 5px 10px;">Uzish</button>
                        </div>
                    </div>

                    <div v-if="userBookings.length === 0" style="text-align: center; padding: 40px; color: var(--ivory-faint);">
                        Sizda bronilashtirish yo'q
                    </div>
                    <div v-else>
                        <table class="bookings-table">
                            <thead>
                                <tr>
                                    <th>Sartorosh</th>
                                    <th>Xizmat</th>
                                    <th>Sana & Vaqt</th>
                                    <th>Narxi</th>
                                    <th>Holat</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="booking in userBookings" :key="booking.id">
                                    <td>{{ booking.barberName }}</td>
                                    <td>{{ booking.serviceName }}</td>
                                    <td>{{ formatDate(booking.date) }} {{ booking.time }}</td>
                                    <td>{{ booking.price.toLocaleString() }} so'm</td>
                                    <td>
                                        <span class="status-badge" :class="booking.status">
                                            {{ getStatusLabel(booking.status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            v-if="booking.status === 'confirmed'"
                                            class="btn btn-danger" 
                                            @click="cancelBooking(booking.id)"
                                            style="font-size: 12px; padding: 5px 10px;"
                                        >
                                            Bekor qilish
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="activeTab === 'reviews'" class="dashboard">
                    <div style="margin-bottom: 30px;">
                        <h3 style="margin-bottom: 15px; color: var(--ivory);">Sartorosh haqida sharh qoldiring</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Sartorosh tanlang</label>
                                <select v-model="reviewForm.barberId">
                                    <option value="">Sartorosh tanlang...</option>
                                    <option v-for="barber in barbers" :key="barber.id" :value="barber.id">
                                        {{ barber.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Reyting (1-5)</label>
                                <input v-model.number="reviewForm.rating" type="number" min="1" max="5">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Sharh</label>
                            <textarea v-model="reviewForm.comment" placeholder="O'z fikringizni yozing..." style="padding: 10px; border: 1px solid var(--border-subtle); border-radius: 12px; min-height: 100px; background: rgba(255,255,255,0.04); color: var(--ivory); font-family: inherit; font-size: 14px;"></textarea>
                        </div>
                        <button class="btn btn-primary" @click="submitReview" style="width: 100%; padding: 12px; margin-top: 10px;">
                            Sharhni jo'natish
                        </button>
                    </div>
                </div>

                <div v-if="activeTab === 'admin' && currentUser.isAdmin" class="admin-section">
                    <h3 style="color: var(--ivory);">⚙️ Admin Panel</h3>

                    <div class="admin-form">
                        <h4 style="margin-bottom: 15px;">Yangi Xizmat Qo'shish</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Xizmat nomi</label>
                                <input v-model="adminForm.serviceName" type="text" placeholder="Masalan: Tuzoq kesish">
                            </div>
                            <div class="form-group">
                                <label>Narxi (so'm)</label>
                                <input v-model.number="adminForm.servicePrice" type="number">
                            </div>
                            <div class="form-group">
                                <label>Vaqti (min)</label>
                                <input v-model.number="adminForm.serviceDuration" type="number">
                            </div>
                        </div>
                        <button class="btn btn-primary" @click="addService">Xizmat qo'shish</button>
                    </div>

                    <div class="admin-form">
                        <h4 style="margin-bottom: 15px;">Yangi Sartorosh Qo'shish</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Sartorosh ismi</label>
                                <input v-model="adminForm.barberName" type="text" placeholder="Masalan: Ali">
                            </div>
                            <div class="form-group">
                                <label>Reyting</label>
                                <input v-model.number="adminForm.barberRating" type="number" min="1" max="5" step="0.1">
                            </div>
                            <div class="form-group">
                                <label>Avatar</label>
                                <input v-model="adminForm.barberAvatar" type="text" placeholder="Emoji: 💇">
                            </div>
                        </div>
                        <button class="btn btn-primary" @click="addBarber">Sartorosh qo'shish</button>
                    </div>

                    <div class="admin-form">
                        <h4 style="margin-bottom: 15px;">🧹 Dublikat Sartoroshlarni Tozalash</h4>
                        <p style="font-size: 13px; color: var(--ivory-faint); margin-bottom: 10px;">
                            Bir xil ismli sartaroshlardan faqat bittasini (eng ko'p sharhga egasini) qoldiradi.
                            Boshqalarning bronlari va sharhlari shu asosiy sartaroshga ko'chiriladi, so'ng dublikatlar o'chiriladi.
                        </p>
                        <button class="btn btn-danger" @click="cleanupDuplicateBarbers">Dublikatlarni tozalash</button>
                    </div>

                    <div class="admin-form">
                        <h4 style="margin-bottom: 15px;">Xizmat narxlarini yangilash</h4>
                        <table class="services-table">
                            <thead>
                                <tr>
                                    <th>Xizmat</th>
                                    <th>Narx (so'm)</th>
                                    <th>Vaqt (min)</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="service in services" :key="service.id">
                                    <td>{{ service.name }}</td>
                                    <td>
                                        <input type="number" v-model.number="service.editPrice" min="0" class="inline-input">
                                    </td>
                                    <td>
                                        <input type="number" v-model.number="service.editDuration" min="5" class="inline-input">
                                    </td>
                                    <td>
                                        <button class="btn btn-success" @click="saveServiceChanges(service)">Saqlash</button>
                                        <button class="btn btn-danger" @click="deleteService(service)" style="margin-left: 8px;">O'chirish</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="admin-form">
                        <h4 style="margin-bottom: 15px;">Bronilashtirish Holatini O'zgartirish</h4>
                        <table class="bookings-table">
                            <thead>
                                <tr>
                                    <th>Foydalanuvchi</th>
                                    <th>Sartorosh</th>
                                    <th>Sana & Vaqt</th>
                                    <th>Holat</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="booking in allBookings" :key="booking.id">
                                    <td>{{ booking.userName }}</td>
                                    <td>{{ booking.barberName }}</td>
                                    <td>{{ formatDate(booking.date) }} {{ booking.time }}</td>
                                    <td>{{ getStatusLabel(booking.status) }}</td>
                                    <td>
                                        <select v-model="booking.status" style="padding: 8px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-elevated); color: var(--ivory);">
                                            <option value="confirmed">Tasdiqlangan</option>
                                            <option value="pending">Kutayotgan</option>
                                            <option value="cancelled">Bekor qilingan</option>
                                        </select>
                                        <button class="btn btn-success" @click="updateBookingStatus(booking)" style="margin-left: 5px; font-size: 12px; padding: 5px 10px;">
                                            Saqlash
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="activeTab === 'barbers'" class="dashboard">
                    <h3 style="margin-bottom: 20px; color: var(--ivory);">👨‍💼 Bizning Sartoroshlar</h3>
                    <div class="barbers-grid">
                        <div v-for="barber in barbers" :key="barber.id" class="barber-card">
                            <div class="barber-avatar">{{ barber.avatar }}</div>
                            <div class="barber-name">{{ barber.name }}</div>
                            <div class="barber-rating">⭐ {{ barber.rating }}/5</div>
                            <div class="barber-status" :class="{ busy: barber.available === false }">
                                {{ barber.available ? "Bo'sh" : "Band" }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'services'" class="dashboard">
                    <h3 style="margin-bottom: 20px; color: var(--ivory);">💈 Bizning Xizmatlar</h3>
                    <div class="services-grid">
                        <div v-for="service in services" :key="service.id" class="service-card">
                            <div class="service-name">{{ service.name }}</div>
                            <div class="service-price">{{ service.price.toLocaleString() }} so'm</div>
                            <div class="service-duration">⏱️ {{ service.duration }} min</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            isLogin: true,
            isLoading: true,
            currentUser: null,
            authForm: {
                fullName: '',
                email: '',
                password: '',
                phone: ''
            },
            telegramChatIdInput: '',
            authError: '',
            successMessage: '',
            errorMessage: '',
            services: [],
            barbers: [],
            bookings: [],
            activeTab: 'booking',
            mobileMenuSelected: null,
            selectedService: null,
            selectedBarber: null,
            selectedDate: null,
            selectedTime: null,
            currentMonth: new Date(),
            reviewForm: {
                barberId: '',
                rating: 5,
                comment: ''
            },
            adminForm: {
                serviceName: '',
                servicePrice: 0,
                serviceDuration: 30,
                barberName: '',
                barberRating: 5,
                barberAvatar: '💇'
            },
            timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
        };
    },

    computed: {
        tabs() {
            const baseTabs = ['booking', 'myBookings', 'reviews', 'barbers', 'services'];
            if (this.currentUser?.isAdmin) {
                baseTabs.push('admin');
            }
            return baseTabs;
        },

        mobileMenus() {
            const base = [
                { id: 'booking', icon: '📅', label: 'Bron' },
                { id: 'services', icon: '✂️', label: 'Xizmatlar' },
                { id: 'myBookings', icon: '🧾', label: 'Bronlarim' },
                { id: 'barbers', icon: '💈', label: 'Sartoroshlar' },
                { id: 'reviews', icon: '⭐', label: 'Sharhlar' }
            ];
            if (this.currentUser?.isAdmin) {
                base.push({ id: 'admin', icon: '⚙️', label: 'Admin' });
            }
            return base;
        },

        mobileMenuActions() {
            const actions = {
                booking: [
                    { id: 'booking', name: 'Bron qilish' },
                    { id: 'services', name: 'Xizmatlar' },
                    { id: 'myBookings', name: 'Mening bronlarim' }
                ],
                services: [
                    { id: 'services', name: 'Xizmatlar' },
                    { id: 'booking', name: 'Bron qilish' }
                ],
                myBookings: [
                    { id: 'myBookings', name: 'Mening bronlarim' }
                ],
                barbers: [
                    { id: 'barbers', name: 'Sartoroshlar' }
                ],
                reviews: [
                    { id: 'reviews', name: 'Sharhlar' }
                ],
                admin: [
                    { id: 'admin', name: 'Admin paneli' }
                ]
            };
            return actions[this.mobileMenuSelected] || [];
        },

        calendarDays() {
            const year = this.currentMonth.getFullYear();
            const month = this.currentMonth.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());

            const days = [];
            let currentDate = new Date(startDate);

            while (currentDate <= lastDay || currentDate.getDay() !== 0) {
                const dateStr = this.formatDateStr(currentDate);
                const today = this.formatDateStr(new Date());
                const isToday = dateStr === today;
                const currentMonthFlag = currentDate.getMonth() === month;

                days.push({
                    date: currentDate.getDate(),
                    dateStr,
                    isToday,
                    currentMonth: currentMonthFlag
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            return days;
        },

        currentMonthName() {
            const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
            return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
        },

        availableTimeSlots() {
            return this.timeSlots.filter(time => this.isTimeAvailable(time));
        },

        userBookings() {
            return this.bookings.filter(b => b.userId === this.currentUser.id);
        },

        allBookings() {
            return this.bookings;
        },

        liveQueue() {
            const today = new Date().toISOString().slice(0, 10);
            return this.bookings
                .filter(b => b.status === 'confirmed' && b.date >= today)
                .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
        }
    },

    methods: {
        toggleAuthMode() {
            this.isLogin = !this.isLogin;
            this.authError = '';
        },

        selectMobileMenu(menuId) {
            if (this.mobileMenuSelected === menuId) {
                this.mobileMenuSelected = null;
            } else {
                this.mobileMenuSelected = menuId;
            }
        },

        openMobileMenuAction(actionId) {
            this.activeTab = actionId;
            this.mobileMenuSelected = actionId;
        },

        async signInWithGoogle() {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await auth.signInWithPopup(provider);
            } catch (error) {
                // Fallback: agar popup bloklansa yoki ishlamasa, redirect bilan urinib ko'ramiz
                const provider = new firebase.auth.GoogleAuthProvider();
                if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/operation-not-supported-in-this-environment') {
                    try {
                        await auth.signInWithRedirect(provider);
                    } catch (err) {
                        this.authError = err.message;
                    }
                } else {
                    this.authError = error.message;
                }
            }
        },

        async authenticate() {
            this.authError = '';
            if (!this.authForm.email || !this.authForm.password) {
                this.authError = 'Email va parol kiritilishi shart';
                return;
            }

            if (this.isLogin) {
                try {
                    await auth.signInWithEmailAndPassword(this.authForm.email, this.authForm.password);
                } catch (error) {
                    this.authError = error.message;
                }
            } else {
                if (!this.authForm.fullName) {
                    this.authError = 'Ism familiya kiritilishi shart';
                    return;
                }

                try {
                    const userCredential = await auth.createUserWithEmailAndPassword(this.authForm.email, this.authForm.password);
                    await userCredential.user.updateProfile({ displayName: this.authForm.fullName });
                    await this.createUserProfile(userCredential.user, {
                        fullName: this.authForm.fullName,
                        phone: this.authForm.phone
                    });
                } catch (error) {
                    this.authError = error.message;
                }
            }
        },

        async createUserProfile(user, profileData = {}) {
            try {
                const profile = {
                    fullName: profileData.fullName || user.displayName || 'Foydalanuvchi',
                    displayName: user.displayName || profileData.fullName || 'Foydalanuvchi',
                    email: user.email,
                    phone: profileData.phone || '',
                    telegramChatId: profileData.telegramChatId || '',
                    isAdmin: this.isAdminEmail(user.email),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await db.collection('users').doc(user.uid).set(profile, { merge: true });
            } catch (error) {
                console.error('Foydalanuvchi profile yaratishda xato:', error);
            }
        },

        isAdminEmail(email) {
            return ADMIN_EMAILS.includes(email?.toLowerCase());
        },

        async handleAuthStateChanged(user) {
            if (!user) {
                this.currentUser = null;
                this.isLoading = false;
                return;
            }

            try {
                const userRef = db.collection('users').doc(user.uid);
                const doc = await userRef.get();

                if (doc.exists) {
                    const profile = doc.data();
                    this.currentUser = {
                        id: user.uid,
                        email: user.email,
                        fullName: profile.fullName || user.displayName,
                        displayName: profile.displayName || user.displayName,
                        phone: profile.phone || '',
                        telegramChatId: profile.telegramChatId || '',
                        isAdmin: profile.isAdmin || this.isAdminEmail(user.email)
                    };

                    if (profile.email !== user.email || profile.displayName !== user.displayName || profile.isAdmin !== this.isAdminEmail(user.email)) {
                        await userRef.set({
                            email: user.email,
                            displayName: user.displayName,
                            isAdmin: this.isAdminEmail(user.email)
                        }, { merge: true });
                    }
                } else {
                    await this.createUserProfile(user, {
                        fullName: user.displayName || this.authForm.fullName,
                        phone: ''
                    });
                    this.currentUser = {
                        id: user.uid,
                        email: user.email,
                        fullName: user.displayName || this.authForm.fullName || 'Foydalanuvchi',
                        displayName: user.displayName || this.authForm.fullName || 'Foydalanuvchi',
                        phone: '',
                        telegramChatId: '',
                        isAdmin: this.isAdminEmail(user.email)
                    };
                }

                this.activeTab = 'booking';
                this.authError = '';
                this.isLoading = false;

                // Boshlang'ich ma'lumotlarni faqat admin to'ldira oladi (Firestore qoidalariga mos)
                if (this.currentUser.isAdmin) {
                    this.seedInitialData();
                }
            } catch (error) {
                console.error('Auth state xatosi:', error);
                this.errorMessage = 'Foydalanuvchi maʼlumotlarini yuklashda xato yuz berdi';
                this.isLoading = false;
            }
        },

        async logout() {
            try {
                await auth.signOut();
                this.currentUser = null;
                this.selectedService = null;
                this.selectedBarber = null;
                this.selectedDate = null;
                this.selectedTime = null;
                this.activeTab = 'booking';
                this.authForm = { fullName: '', email: '', password: '', phone: '' };
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        selectDate(day) {
            if (!day.currentMonth) return;
            const today = new Date();
            const selected = new Date(day.dateStr + 'T00:00:00');
            if (selected >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                this.selectedDate = day.dateStr;
                this.selectedTime = null;
            }
        },

        isTimeAvailable(time) {
            if (!this.selectedDate || !this.selectedBarber) return true;
            const booking = this.bookings.find(b =>
                b.barberId === this.selectedBarber.id &&
                b.date === this.selectedDate &&
                b.time === time &&
                b.status !== 'cancelled'
            );
            return !booking;
        },

        async confirmBooking() {
            if (!this.selectedService || !this.selectedBarber || !this.selectedDate || !this.selectedTime) {
                this.errorMessage = 'Iltimos, barcha bron maʼlumotlarini tanlang';
                return;
            }

            try {
                // Вақт слотинг дубл-бронирование қилинмаслигини текшириш
                const existingBooking = await db.collection('bookings')
                    .where('barberId', '==', this.selectedBarber.id)
                    .where('date', '==', this.selectedDate)
                    .where('time', '==', this.selectedTime)
                    .get();

                const hasActiveBooking = existingBooking.docs.some(doc => doc.data().status !== 'cancelled');

                if (hasActiveBooking) {
                    this.errorMessage = 'Ёрли бон! Бу вақтда сартарош аллақачон бронирования қилинган. Бошқа вақтни танланг.';
                    // Вақт слотлари қайта ўндаш
                    this.setupRealtimeListeners();
                    return;
                }

                await db.collection('bookings').add({
                    userId: this.currentUser.id,
                    userName: this.currentUser.fullName || this.currentUser.displayName,
                    userEmail: this.currentUser.email,
                    barberId: this.selectedBarber.id,
                    barberName: this.selectedBarber.name,
                    serviceId: this.selectedService.id,
                    serviceName: this.selectedService.name,
                    price: this.selectedService.price,
                    date: this.selectedDate,
                    time: this.selectedTime,
                    status: 'confirmed',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Admin'ga Telegram orqali bildirishnoma yuborish (xato bo'lsa ham bronni bloklamaydi)
                const clientName = this.currentUser.fullName || this.currentUser.displayName || this.currentUser.email || 'Mijoz';
                sendTelegramNotification(
                    `🔔 <b>Yangi bronilashtirish!</b>\n\n` +
                    `👤 Mijoz: ${clientName}\n` +
                    `💈 Xizmat: ${this.selectedService.name}\n` +
                    `✂️ Sartarosh: ${this.selectedBarber.name}\n` +
                    `📅 Sana: ${this.selectedDate}\n` +
                    `🕐 Vaqt: ${this.selectedTime}\n` +
                    `💰 Narx: ${this.selectedService.price} so'm`
                );

                // Mijozga ham, agar Telegram ulagan bo'lsa, tasdiq xabari
                if (this.currentUser.telegramChatId) {
                    sendTelegramNotification(
                        `✅ <b>Broningiz tasdiqlandi!</b>\n\n` +
                        `💈 Xizmat: ${this.selectedService.name}\n` +
                        `✂️ Sartarosh: ${this.selectedBarber.name}\n` +
                        `📅 Sana: ${this.selectedDate}\n` +
                        `🕐 Vaqt: ${this.selectedTime}\n` +
                        `💰 Narx: ${this.selectedService.price} so'm\n\n` +
                        `Kutib qolamiz! 💇`,
                        this.currentUser.telegramChatId
                    );
                }

                this.successMessage = '✓ Bronilashtirish muvaffaqiyatli saqlandi!';
                this.selectedService = null;
                this.selectedBarber = null;
                this.selectedDate = null;
                this.selectedTime = null;
                this.activeTab = 'myBookings';
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        bookingCountForBarber(barberId) {
            return this.bookings.filter(b => b.barberId === barberId && b.status === 'confirmed' && b.date >= new Date().toISOString().slice(0, 10)).length;
        },

        async saveTelegramChatId() {
            const chatId = this.telegramChatIdInput.trim();
            if (!chatId || !/^\d+$/.test(chatId)) {
                this.errorMessage = 'Iltimos, faqat raqamlardan iborat Chat ID kiriting';
                return;
            }

            try {
                await db.collection('users').doc(this.currentUser.id).update({ telegramChatId: chatId });
                this.currentUser.telegramChatId = chatId;
                this.telegramChatIdInput = '';
                this.successMessage = '✓ Telegram ulandi! Endi bron tasdiqlari shu yerga keladi.';

                sendTelegramNotification(
                    `👋 Salom, ${this.currentUser.fullName || this.currentUser.displayName}! Endi bronlaringiz haqida shu yerga xabar keladi.`,
                    chatId
                );

                setTimeout(() => this.successMessage = '', 4000);
            } catch (error) {
                this.errorMessage = 'Telegram ulashda xato: ' + error.message;
            }
        },

        async unlinkTelegramChatId() {
            try {
                await db.collection('users').doc(this.currentUser.id).update({ telegramChatId: '' });
                this.currentUser.telegramChatId = '';
                this.successMessage = '✓ Telegram uzildi';
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async cancelBooking(bookingId) {
            try {
                const booking = this.bookings.find(b => b.id === bookingId);

                await db.collection('bookings').doc(bookingId).update({ status: 'cancelled' });

                if (booking) {
                    sendTelegramNotification(
                        `❌ <b>Bron bekor qilindi</b>\n\n` +
                        `👤 Mijoz: ${booking.userName || booking.userEmail}\n` +
                        `💈 Xizmat: ${booking.serviceName}\n` +
                        `✂️ Sartarosh: ${booking.barberName}\n` +
                        `📅 Sana: ${booking.date}\n` +
                        `🕐 Vaqt: ${booking.time}`
                    );
                }

                this.successMessage = '✓ Bronilashtirish bekor qilindi';
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async submitReview() {
            if (!this.reviewForm.barberId || !this.reviewForm.comment) {
                this.errorMessage = 'Iltimos, barcha maydonlarni to‘ldiring';
                return;
            }

            const barber = this.barbers.find(b => b.id === this.reviewForm.barberId);
            if (!barber) {
                this.errorMessage = 'Tanlangan sartorosh topilmadi';
                return;
            }

            try {
                const currentRating = Number(barber.rating) || 0;
                const currentCount = Number(barber.reviewCount) || 0;
                const nextCount = currentCount + 1;
                const nextRating = Number(((currentRating * currentCount + this.reviewForm.rating) / nextCount).toFixed(1));

                await db.collection('reviews').add({
                    userId: this.currentUser.id,
                    userName: this.currentUser.fullName || this.currentUser.displayName,
                    barberId: barber.id,
                    barberName: barber.name,
                    rating: this.reviewForm.rating,
                    comment: this.reviewForm.comment,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                await db.collection('barbers').doc(barber.id).update({
                    rating: nextRating,
                    reviewCount: firebase.firestore.FieldValue.increment(1)
                });

                this.successMessage = '✓ Sharhingiz jo‘natildi';
                this.reviewForm = { barberId: '', rating: 5, comment: '' };
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async addService() {
            if (!this.adminForm.serviceName || !this.adminForm.servicePrice) {
                this.errorMessage = 'Iltimos, barcha maydonlarni to‘ldiring';
                return;
            }

            try {
                await db.collection('services').add({
                    name: this.adminForm.serviceName,
                    price: this.adminForm.servicePrice,
                    duration: this.adminForm.serviceDuration,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                this.successMessage = '✓ Xizmat qo‘shildi';
                this.adminForm.serviceName = '';
                this.adminForm.servicePrice = 0;
                this.adminForm.serviceDuration = 30;
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async saveServiceChanges(service) {
            if (!service.editPrice || service.editPrice <= 0) {
                this.errorMessage = 'Iltimos, xizmat narxini to‘g‘ri kiriting';
                return;
            }

            try {
                await db.collection('services').doc(service.id).update({
                    price: service.editPrice,
                    duration: service.editDuration
                });
                this.successMessage = `✓ ${service.name} narxi yangilandi`;
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async deleteService(service) {
            const confirmed = confirm(`"${service.name}" xizmatini o'chirishni xohlaysizmi?`);
            if (!confirmed) return;

            try {
                await db.collection('services').doc(service.id).delete();
                this.successMessage = `✓ ${service.name} o‘chirildi`;
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async addBarber() {
            if (!this.adminForm.barberName) {
                this.errorMessage = 'Iltimos, sartorosh ismini kiriting';
                return;
            }

            try {
                const barberDoc = await db.collection('barbers').where('name', '==', this.adminForm.barberName).get();
                if (!barberDoc.empty) {
                    this.errorMessage = `${this.adminForm.barberName} allaqachon mavjud`;
                    return;
                }

                await db.collection('barbers').add({
                    name: this.adminForm.barberName,
                    rating: this.adminForm.barberRating,
                    avatar: this.adminForm.barberAvatar || '💇',
                    available: true,
                    reviewCount: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                this.successMessage = '✓ Sartorosh qo‘shildi';
                this.adminForm.barberName = '';
                this.adminForm.barberRating = 5;
                this.adminForm.barberAvatar = '💇';
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        async cleanupDuplicateBarbers() {
            if (!confirm('Dublikat sartoroshlarni tozalashni tasdiqlaysizmi? Bu amalni qaytarib bo\'lmaydi.')) {
                return;
            }

            try {
                const snapshot = await db.collection('barbers').get();
                const allBarbers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Har bir sartarosh uchun bron sonini hisoblash
                const bookingsSnapshot = await db.collection('bookings').get();
                const bookingCounts = {};
                bookingsSnapshot.docs.forEach(doc => {
                    const barberId = doc.data().barberId;
                    bookingCounts[barberId] = (bookingCounts[barberId] || 0) + 1;
                });

                // Ismi bo'yicha guruhlash
                const groups = {};
                allBarbers.forEach(barber => {
                    if (!groups[barber.name]) groups[barber.name] = [];
                    groups[barber.name].push(barber);
                });

                let removedCount = 0;

                for (const name in groups) {
                    const group = groups[name];
                    if (group.length <= 1) continue; // Dublikat yo'q

                    // Eng ko'p bronga ega bo'lganini "asosiy" deb tanlaymiz
                    group.sort((a, b) => (bookingCounts[b.id] || 0) - (bookingCounts[a.id] || 0));
                    const primary = group[0];
                    const duplicates = group.slice(1);

                    // Reyting va sharhlar sonini hamma dublikatlar boyicha jamlash
                    let totalReviewCount = Number(primary.reviewCount) || 0;
                    let weightedRatingSum = (Number(primary.rating) || 0) * totalReviewCount;

                    for (const dup of duplicates) {
                        const dupReviewCount = Number(dup.reviewCount) || 0;
                        const dupRating = Number(dup.rating) || 0;
                        weightedRatingSum += dupRating * dupReviewCount;
                        totalReviewCount += dupReviewCount;

                        // Dublikatga tegishli bookinglarni asosiy sartaroshga ko'chirish
                        const dupBookings = await db.collection('bookings').where('barberId', '==', dup.id).get();
                        const bookingUpdates = dupBookings.docs.map(doc =>
                            doc.ref.update({ barberId: primary.id, barberName: primary.name })
                        );
                        await Promise.all(bookingUpdates);

                        // Dublikatga tegishli sharhlarni asosiy sartaroshga ko'chirish
                        const dupReviews = await db.collection('reviews').where('barberId', '==', dup.id).get();
                        const reviewUpdates = dupReviews.docs.map(doc =>
                            doc.ref.update({ barberId: primary.id, barberName: primary.name })
                        );
                        await Promise.all(reviewUpdates);

                        // Dublikatni o'chirish
                        await db.collection('barbers').doc(dup.id).delete();
                        removedCount++;
                    }

                    // Asosiy sartaroshning reyting va sharhlar sonini yangilash
                    if (duplicates.length > 0) {
                        const finalRating = totalReviewCount > 0
                            ? Number((weightedRatingSum / totalReviewCount).toFixed(1))
                            : (Number(primary.rating) || 0);
                        await db.collection('barbers').doc(primary.id).update({
                            rating: finalRating,
                            reviewCount: totalReviewCount
                        });
                    }
                }

                this.successMessage = removedCount > 0
                    ? `✓ ${removedCount} ta dublikat sartorosh o'chirildi`
                    : 'Dublikat topilmadi';
                setTimeout(() => this.successMessage = '', 4000);
            } catch (error) {
                this.errorMessage = 'Tozalashda xato: ' + error.message;
            }
        },

        async updateBookingStatus(booking) {
            try {
                await db.collection('bookings').doc(booking.id).update({ status: booking.status });
                this.successMessage = '✓ Bron holati yangilandi';
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        previousMonth() {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
            this.selectedDate = null;
        },

        nextMonth() {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
            this.selectedDate = null;
        },

        formatDate(dateStr) {
            const date = new Date(dateStr + 'T00:00:00');
            const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
            const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
            return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
        },

        formatDateStr(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        getTabLabel(tab) {
            const labels = {
                'booking': '📅 Bronlash',
                'myBookings': '📋 Mening Bronilashtirmalarim',
                'reviews': '⭐ Sharhlar',
                'barbers': '👨‍💼 Sartoroshlar',
                'services': '💈 Xizmatlar',
                'admin': '⚙️ Admin'
            };
            return labels[tab] || tab;
        },

        getStatusLabel(status) {
            const labels = {
                'confirmed': '✓ Tasdiqlangan',
                'pending': '⏳ Kutayotgan',
                'cancelled': '✗ Bekor qilingan'
            };
            return labels[status] || status;
        },

        setupRealtimeListeners() {
            db.collection('services').orderBy('name').onSnapshot(snapshot => {
                this.services = snapshot.docs.map(doc => {
                    const service = { id: doc.id, ...doc.data() };
                    service.editPrice = service.price;
                    service.editDuration = service.duration;
                    return service;
                });
            });

            db.collection('barbers').orderBy('name').onSnapshot(snapshot => {
                this.barbers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            });

            db.collection('bookings').orderBy('date', 'desc').onSnapshot(snapshot => {
                this.bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            });
        },

        async seedInitialData() {
            try {
                const servicesSnapshot = await db.collection('services').limit(1).get();
                if (servicesSnapshot.empty) {
                    const defaultServices = [
                        { name: 'Tuzoq kesish', price: 50000, duration: 30 },
                        { name: 'Saqqal olish', price: 30000, duration: 20 },
                        { name: 'Tuzoq + Saqqal', price: 70000, duration: 45 },
                        { name: 'Soch bo\'yash', price: 100000, duration: 60 }
                    ];
                    defaultServices.forEach(service => db.collection('services').add({ ...service, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
                }

                const barbersSnapshot = await db.collection('barbers').limit(1).get();
                if (barbersSnapshot.empty) {
                    const defaultBarbers = [
                        { name: 'Sardor', rating: 4.9, avatar: '💈', available: true, reviewCount: 12 },
                        { name: 'Doston', rating: 4.8, avatar: '✂️', available: true, reviewCount: 10 }
                    ];
                    defaultBarbers.forEach(barber => db.collection('barbers').add({ ...barber, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
                }
            } catch (error) {
                console.error('Maʼlumotlarni seed qilishda xato:', error);
            }
        }
    },

    mounted() {
        initializeFirebase();
        if (!auth || !db) {
            this.errorMessage = 'Firebase yuklanmadi. Konfiguratsiyani tekshiring.';
            this.isLoading = false;
            return;
        }

        auth.onAuthStateChanged(user => this.handleAuthStateChanged(user));

        // Handle redirect result when using signInWithRedirect fallback
        auth.getRedirectResult()
            .then(result => {
                if (result && result.user) {
                    console.log('Google sign-in redirect result:', result.user);
                    this.handleAuthStateChanged(result.user);
                }
            })
            .catch(err => {
                console.error('Redirect sign-in error:', err);
                this.authError = err.message || String(err);
            });
        this.setupRealtimeListeners();
    }
});

app.mount('#app');