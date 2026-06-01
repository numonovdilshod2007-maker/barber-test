const { createApp } = Vue;

const app = createApp({
    template: `
        <div class="container">
            <!-- Loading Screen -->
            <div v-if="isLoading" style="text-align: center; padding: 100px;">
                <div class="spinner"></div>
                <p style="color: #666; margin-top: 20px;">Yuklanmoqda...</p>
            </div>

            <!-- Auth Page -->
            <div v-if="!currentUser && !isLoading" class="auth-page">
                <div class="auth-form">
                    <h2>{{ isLogin ? "Kirishni ko'ngilamang" : "Ro'yxatdan o'tish" }}</h2>
                    
                    <div v-if="authError" class="alert alert-error">{{ authError }}</div>
                    
                    <!-- Google Sign-In Button -->
                    <div style="margin-bottom: 20px;">
                        <button class="btn btn-primary" @click="signInWithGoogle" style="width: 100%; padding: 12px; background: #4285f4;">
                            🔐 Google bilan kirish
                        </button>
                    </div>
                    
                    <div style="text-align: center; color: #999; margin-bottom: 20px;">yoki</div>

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
                        <button @click="isLogin = !isLogin">{{ isLogin ? "Ro'yxatdan o'tish" : "Kirish" }}</button>
                    </div>
                </div>
            </div>

            <!-- Dashboard -->
            <div v-if="currentUser && !isLoading">
                <!-- Header -->
                <div class="header">
                    <div class="logo">💇 Sartorosh Honasi</div>
                    <div class="user-info">
                        <span>Xush kelibsiz, {{ currentUser.displayName || currentUser.fullName }}!</span>
                        <button class="btn btn-secondary" @click="logout">Chiqish</button>
                    </div>
                </div>

                <!-- Alerts -->
                <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
                <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

                <!-- Tabs -->
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

                <!-- Booking Tab -->
                <div v-if="activeTab === 'booking'" class="dashboard">
                    <div class="alert alert-info">
                        📅 Quyidagi bosqichlarni amalga oshiring: 1) Xizmatni tanlang 2) Sartoroshni tanlang 3) Vaqtni tanlang 4) Bronilashtiring
                    </div>

                    <!-- Step 1: Select Service -->
                    <div>
                        <h3 style="margin-bottom: 15px; color: #333;">1️⃣ Xizmatni tanlang</h3>
                        <div v-if="services.length === 0" style="color: #999;">Xizmatlar yuklanmoqda...</div>
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

                    <!-- Step 2: Select Barber -->
                    <div style="margin-top: 30px;">
                        <h3 style="margin-bottom: 15px; color: #333;">2️⃣ Sartoroshni tanlang</h3>
                        <div v-if="barbers.length === 0" style="color: #999;">Sartoroshlar yuklanmoqda...</div>
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
                            </div>
                        </div>
                    </div>

                    <!-- Step 3 & 4: Select Date & Time -->
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
                            <div v-else style="color: #999; text-align: center; padding: 20px;">
                                Iltimos, avval sanani tanlang
                            </div>
                        </div>
                    </div>

                    <!-- Confirmation -->
                    <div v-if="selectedService && selectedBarber && selectedDate && selectedTime" style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h3 style="margin-bottom: 15px; color: #333;">📋 Bronilashtirish Tafsillari</h3>
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

                <!-- My Bookings Tab -->
                <div v-if="activeTab === 'myBookings'" class="dashboard">
                    <div v-if="userBookings.length === 0" style="text-align: center; padding: 40px; color: #999;">
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

                <!-- Reviews Tab -->
                <div v-if="activeTab === 'reviews'" class="dashboard">
                    <div style="margin-bottom: 30px;">
                        <h3 style="margin-bottom: 15px; color: #333;">Sartorosh haqida sharh qoldiring</h3>
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
                            <textarea v-model="reviewForm.comment" placeholder="O'z fikringizni yozing..." style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 100px; font-family: inherit; font-size: 14px;"></textarea>
                        </div>
                        <button class="btn btn-primary" @click="submitReview" style="width: 100%; padding: 12px; margin-top: 10px;">
                            Sharhni jo'natish
                        </button>
                    </div>
                </div>

                <!-- Barbers Info Tab -->
                <div v-if="activeTab === 'barbers'" class="dashboard">
                    <h3 style="margin-bottom: 20px; color: #333;">👨‍💼 Bizning Sartoroshlar</h3>
                    <div v-if="barbers.length === 0" style="color: #999;">Sartoroshlar yuklanmoqda...</div>
                    <div v-else class="barbers-grid">
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

                <!-- Services Info Tab -->
                <div v-if="activeTab === 'services'" class="dashboard">
                    <h3 style="margin-bottom: 20px; color: #333;">💈 Bizning Xizmatlar</h3>
                    <div v-if="services.length === 0" style="color: #999;">Xizmatlar yuklanmoqda...</div>
                    <div v-else class="services-grid">
                        <div v-for="service in services" :key="service.id" class="service-card">
                            <div class="service-name">{{ service.name }}</div>
                            <div class="service-price">{{ service.price.toLocaleString() }} so'm</div>
                            <div class="service-duration">⏱️ {{ service.duration }} min</div>
                        </div>
                    </div>
                </div>

                <!-- Admin Tab -->
                <div v-if="activeTab === 'admin' && currentUser.isAdmin" class="admin-section">
                    <h3 style="color: #333;">⚙️ Admin Panel</h3>

                    <!-- Add Service -->
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
                        <button class="btn btn-primary" @click="addService">🔥 Xizmat qo'shish</button>
                    </div>

                    <!-- Add Barber -->
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
                        <button class="btn btn-primary" @click="addBarber">🔥 Sartorosh qo'shish</button>
                    </div>

                    <!-- Manage Bookings -->
                    <div class="admin-form">
                        <h4 style="margin-bottom: 15px;">Bronilashtirish Taqdirini O'zgartirish</h4>
                        <div v-if="allBookings.length === 0" style="color: #999;">Bronilashtirish yo'q</div>
                        <table v-else class="bookings-table">
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
                                        <select v-model="booking.status" style="padding: 5px; border-radius: 3px; border: 1px solid #ddd;">
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
            </div>
        </div>
    `,

    data() {
        return {
            // Auth
            isLogin: true,
            currentUser: null,
            authForm: { fullName: '', email: '', password: '', phone: '' },
            authError: '',
            isLoading: true,

            // Data from Firebase/Storage
            services: [],
            barbers: [],
            bookings: [],
            allBookings: [],

            // UI State
            activeTab: 'booking',
            selectedService: null,
            selectedBarber: null,
            selectedDate: null,
            selectedTime: null,
            currentMonth: new Date(),
            successMessage: '',
            errorMessage: '',

            // Forms
            reviewForm: { barberId: '', rating: 5, comment: '' },
            adminForm: {
                serviceName: '',
                servicePrice: 0,
                serviceDuration: 30,
                barberName: '',
                barberRating: 5,
                barberAvatar: '💇'
            },

            // Calendar
            timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
            unsubscribers: []
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
                const currentMonth = currentDate.getMonth() === month;

                days.push({
                    date: currentDate.getDate(),
                    dateStr: dateStr,
                    isToday: isToday,
                    currentMonth: currentMonth
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
            return this.bookings.filter(b => b.userId === this.currentUser.uid || b.userId === this.currentUser.id);
        }
    },

    methods: {
        // Google Sign-In
        signInWithGoogle() {
            google.accounts.id.renderButton(
                document.querySelector('.auth-form'),
                { theme: "outline", size: "large" }
            );
        },

        // Auth Methods
        async authenticate() {
            if (this.isLogin) {
                // Login
                try {
                    const users = await dataService.getUsers?.() || JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => u.email === this.authForm.email && u.password === this.authForm.password);
                    if (user) {
                        this.currentUser = user;
                        this.authError = '';
                        this.loadUserData();
                    } else {
                        this.authError = 'Email yoki parol notogri';
                    }
                } catch (error) {
                    this.authError = 'Kirish xatosi: ' + error.message;
                }
            } else {
                // Register
                try {
                    if (!this.authForm.fullName || !this.authForm.email || !this.authForm.password) {
                        this.authError = 'Barcha maydonlarni toldiring';
                        return;
                    }

                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    if (users.some(u => u.email === this.authForm.email)) {
                        this.authError = 'Bu email allaqachon royxatdan otgan';
                        return;
                    }

                    const newUser = {
                        id: Date.now(),
                        fullName: this.authForm.fullName,
                        email: this.authForm.email,
                        password: this.authForm.password,
                        phone: this.authForm.phone,
                        isAdmin: false
                    };

                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    this.currentUser = newUser;
                    this.authError = '';
                    this.loadUserData();
                } catch (error) {
                    this.authError = 'Ro\'yxatdan o\'tish xatosi: ' + error.message;
                }
            }
        },

        logout() {
            this.currentUser = null;
            this.unsubscribers.forEach(unsub => unsub?.());
            this.unsubscribers = [];
            this.selectedService = null;
            this.selectedBarber = null;
            this.selectedDate = null;
            this.selectedTime = null;
            this.activeTab = 'booking';
            this.authForm = { fullName: '', email: '', password: '', phone: '' };
        },

        // Load User Data
        async loadUserData() {
            this.isLoading = true;
            try {
                // Load services
                this.services = await dataService.getServices();

                // Load barbers
                this.barbers = await dataService.getBarbers();

                // Load user bookings
                const bookings = await dataService.getBookings(this.currentUser.uid || this.currentUser.id);
                this.bookings = bookings || [];

                // Load all bookings (admin)
                if (this.currentUser.isAdmin) {
                    this.allBookings = await dataService.getAllBookings() || [];
                }

                // Real-time listener for bookings
                if (dataService.onBookingsChange) {
                    const unsub = dataService.onBookingsChange(this.currentUser.uid || this.currentUser.id, (bookings) => {
                        this.bookings = bookings;
                    });
                    this.unsubscribers.push(unsub);
                }

                this.successMessage = '✓ Ma\'lumotlar yuklandi';
                setTimeout(() => this.successMessage = '', 2000);
            } catch (error) {
                this.errorMessage = 'Ma\'lumotlar yuklash xatosi: ' + error.message;
            } finally {
                this.isLoading = false;
            }
        },

        // Booking Methods
        selectDate(day) {
            if (day.currentMonth && new Date(day.dateStr) > new Date()) {
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
            try {
                const bookingData = {
                    userId: this.currentUser.uid || this.currentUser.id,
                    userName: this.currentUser.displayName || this.currentUser.fullName,
                    userEmail: this.currentUser.email,
                    barberId: this.selectedBarber.id,
                    barberName: this.selectedBarber.name,
                    serviceId: this.selectedService.id,
                    serviceName: this.selectedService.name,
                    price: this.selectedService.price,
                    date: this.selectedDate,
                    time: this.selectedTime,
                    status: 'confirmed'
                };

                await dataService.createBooking(bookingData);
                this.successMessage = '✓ Bronilashtirish muvaffaqiyatli saqlandi!';

                this.selectedService = null;
                this.selectedBarber = null;
                this.selectedDate = null;
                this.selectedTime = null;
                this.activeTab = 'myBookings';

                // Reload bookings
                const bookings = await dataService.getBookings(this.currentUser.uid || this.currentUser.id);
                this.bookings = bookings || [];

                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = 'Bronilashtirish xatosi: ' + error.message;
            }
        },

        async cancelBooking(bookingId) {
            try {
                await dataService.cancelBooking(bookingId);
                this.successMessage = '✓ Bronilashtirish bekor qilindi';

                const bookings = await dataService.getBookings(this.currentUser.uid || this.currentUser.id);
                this.bookings = bookings || [];

                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = 'Xato: ' + error.message;
            }
        },

        async submitReview() {
            try {
                if (!this.reviewForm.barberId || !this.reviewForm.comment) {
                    this.errorMessage = 'Iltimos, barcha maydonlarni toldiring';
                    return;
                }

                const reviewData = {
                    userId: this.currentUser.uid || this.currentUser.id,
                    userName: this.currentUser.displayName || this.currentUser.fullName,
                    barberId: this.reviewForm.barberId,
                    barberName: this.barbers.find(b => b.id == this.reviewForm.barberId)?.name,
                    rating: this.reviewForm.rating,
                    comment: this.reviewForm.comment
                };

                await dataService.addReview(reviewData);
                this.successMessage = '✓ Sharhingiz jonatildi';
                this.reviewForm = { barberId: '', rating: 5, comment: '' };

                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = 'Sharh qo\'shish xatosi: ' + error.message;
            }
        },

        // Admin Methods
        async addService() {
            try {
                if (!this.adminForm.serviceName || !this.adminForm.servicePrice) {
                    this.errorMessage = 'Iltimos, barcha maydonlarni toldiring';
                    return;
                }

                await dataService.addService({
                    name: this.adminForm.serviceName,
                    price: this.adminForm.servicePrice,
                    duration: this.adminForm.serviceDuration
                });

                this.successMessage = '✓ Xizmat qoshildi';
                this.adminForm = { serviceName: '', servicePrice: 0, serviceDuration: 30, barberName: '', barberRating: 5, barberAvatar: '💇' };

                // Reload services
                this.services = await dataService.getServices();
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = 'Xizmat qo\'shish xatosi: ' + error.message;
            }
        },

        async addBarber() {
            try {
                if (!this.adminForm.barberName) {
                    this.errorMessage = 'Iltimos, sartorosh ismini kiriting';
                    return;
                }

                await dataService.addBarber({
                    name: this.adminForm.barberName,
                    rating: this.adminForm.barberRating,
                    avatar: this.adminForm.barberAvatar || '💇',
                    available: true
                });

                this.successMessage = '✓ Sartorosh qoshildi';
                this.adminForm = { serviceName: '', servicePrice: 0, serviceDuration: 30, barberName: '', barberRating: 5, barberAvatar: '💇' };

                // Reload barbers
                this.barbers = await dataService.getBarbers();
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = 'Sartorosh qo\'shish xatosi: ' + error.message;
            }
        },

        async updateBookingStatus(booking) {
            try {
                await dataService.updateBookingStatus(booking.id, booking.status);
                this.successMessage = '✓ Bronilashtirish holati ozgartirildi';

                this.allBookings = await dataService.getAllBookings() || [];
                setTimeout(() => this.successMessage = '', 3000);
            } catch (error) {
                this.errorMessage = 'Xato: ' + error.message;
            }
        },

        // Calendar Methods
        previousMonth() {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
            this.selectedDate = null;
        },

        nextMonth() {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
            this.selectedDate = null;
        },

        // Utility Methods
        formatDate(dateStr) {
            const date = new Date(dateStr + ' 00:00:00');
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
        }
    },

    async mounted() {
        // Initialize default data if needed
        if (!localStorage.getItem('services')) {
            const defaultServices = [
                { id: 1, name: 'Tuzoq kesish', price: 50000, duration: 30 },
                { id: 2, name: 'Saqqal olish', price: 30000, duration: 20 },
                { id: 3, name: 'Tuzoq + Saqqal', price: 70000, duration: 45 },
                { id: 4, name: 'Rang ozgartirish', price: 100000, duration: 60 }
            ];
            localStorage.setItem('services', JSON.stringify(defaultServices));
        }

        if (!localStorage.getItem('barbers')) {
            const defaultBarbers = [
                { id: 1, name: 'Ali', rating: 4.8, avatar: '👨‍🦰', available: true },
                { id: 2, name: 'Muhammad', rating: 4.9, avatar: '👨‍🦱', available: true },
                { id: 3, name: 'Usman', rating: 4.7, avatar: '👨‍🦲', available: false },
                { id: 4, name: 'Karim', rating: 4.6, avatar: '👨‍🎓', available: true }
            ];
            localStorage.setItem('barbers', JSON.stringify(defaultBarbers));
        }

        this.isLoading = false;
    }
});

app.mount('#app');
