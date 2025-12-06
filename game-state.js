// =============================================
// GAME STATE MANAGEMENT - TRUE HAPPINESS QUEST
// =============================================

// State game utama
const GameState = {
    // Informasi game saat ini
    currentCharacter: null,      // 'adni' atau 'irma'
    currentScene: 1,            // 1, 2, 3, atau 4
    day: 1,                     // 1, 2, 3, atau 4
    totalDays: 4,               // Total hari permainan
    maxDays: 4,                 // Maksimal hari
    choicesHistory: [],         // Menyimpan riwayat pilihan
    isMobile: false,            // Deteksi perangkat mobile
    isProcessing: false,        // Mencegah multiple clicks
    
    // Stat karakter Adni - UANG SANGAT BESAR (Rp 100 JUTA)
    adni: {
        money: 100000000,       // 100 JUTA UANG - TIDAK AKAN HABIS
        happiness: 50,
        energy: 70,
        social: 30,
        canSpendMoney: true,    // Selalu bisa membelanjakan uang
        lifestyleScore: 0,      // Skor gaya hidup
        mindfulnessScore: 0,    // Skor kesadaran
        generosityScore: 0      // Skor kedermawanan
    },
    
    // Stat karakter Irma - UANG TERBATAS (Rp 200.000)
    irma: {
        money: 200000,          // UANG TERBATAS - Rp 200.000
        happiness: 75,
        energy: 85,
        social: 80,
        canSpendMoney: true,    // Akan dicek berdasarkan uang yang tersedia
        simplicityScore: 0,     // Skor kesederhanaan
        communityScore: 0,      // Skor komunitas
        wisdomScore: 0          // Skor kebijaksanaan
    }
};

// =============================================
// DETEKSI PERANGKAT MOBILE & SETUP AWAL
// =============================================

/**
 * Deteksi apakah perangkat mobile
 */
function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    GameState.isMobile = isMobile;
    console.log(`Mobile device detected: ${isMobile}`);
    return isMobile;
}

/**
 * Setup awal untuk mobile optimization
 */
function setupMobileOptimization() {
    if (GameState.isMobile) {
        // Mencegah zoom pada double-tap
        document.addEventListener('dblclick', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Mencegah pull-to-refresh di iOS
        document.body.style.overscrollBehavior = 'none';
        
        // Optimasi untuk iOS
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
        
        console.log('Mobile optimizations applied');
    }
}

// =============================================
// EFEK PILIHAN UNTUK SEMUA SCENE (HARI 1-4) - HARGA REALISTIS
// =============================================

const ChoiceEffects = {
    // ========== ADNI - HARI 1 ==========
    "adni1-1": { 
        money: -15000000,       // Harga realistis gadget premium: Rp 15 juta
        happiness: 15, 
        energy: -10, 
        social: -5,
        lifestyleScore: 10,
        mindfulnessScore: -5,
        generosityScore: -5,
        message: "Adni membeli gadget terbaru senilai Rp 15.000.000, merasa senang sebentar tapi cepat bosan. Di era digital, teknologi cepat usang." 
    },
    "adni1-2": { 
        money: -5000000,        // Donasi besar: Rp 5 juta
        happiness: 25, 
        energy: 5, 
        social: 15,
        lifestyleScore: 0,
        mindfulnessScore: 10,
        generosityScore: 15,
        message: "Adni bersedekah ke panti asuhan senilai Rp 5.000.000, merasa hidup lebih bermakna. Berbagi memberi kepuasan yang lebih dalam." 
    },
    "adni1-3": { 
        money: 0, 
        happiness: 10, 
        energy: 10, 
        social: 0,
        lifestyleScore: -5,
        mindfulnessScore: 15,
        generosityScore: 5,
        message: "Adni meditasi dan mematikan notifikasi, menemukan ketenangan di tengah kebisingan digital." 
    },
    
    // ========== ADNI - HARI 2 ==========
    "adni2-1": { 
        money: -25000000,       // Setelan mewah desainer: Rp 25 juta
        happiness: 20, 
        energy: -15, 
        social: -10,
        lifestyleScore: 15,
        mindfulnessScore: -10,
        generosityScore: -5,
        message: "Adni membeli setelan mewah desainer senilai Rp 25.000.000 untuk acara penting, tapi merasa kesepian di tengah keramaian." 
    },
    "adni2-2": { 
        money: -3000000,        // Sewa pakaian premium: Rp 3 juta
        happiness: 30, 
        energy: 10, 
        social: 20,
        lifestyleScore: 5,
        mindfulnessScore: 5,
        generosityScore: 0,
        message: "Adni menyewa pakaian premium senilai Rp 3.000.000 dan tetap percaya diri tanpa berlebihan. Gaya tidak harus mahal." 
    },
    "adni2-3": { 
        money: 0, 
        happiness: 15, 
        energy: 5, 
        social: 5,
        lifestyleScore: -5,
        mindfulnessScore: 10,
        generosityScore: 5,
        message: "Adni memakai pakaian terbaik yang sudah dimiliki, merasa nyaman dengan diri sendiri." 
    },
    
    // ========== ADNI - HARI 3 ==========
    "adni3-1": { 
        money: -10000000,       // Lembur dengan bonus kecil: pengeluaran makan, transport, dll
        happiness: 25, 
        energy: -20, 
        social: -5,
        lifestyleScore: 5,
        mindfulnessScore: -10,
        generosityScore: 0,
        message: "Adni mengambil proyek lembur dengan pengeluaran Rp 10.000.000, dapat bonus tapi kelelahan. Workaholic tidak selalu bahagia." 
    },
    "adni3-2": { 
        money: -8000000,        // Makan mewah dengan keluarga: Rp 8 juta
        happiness: 35, 
        energy: 15, 
        social: 25,
        lifestyleScore: 8,
        mindfulnessScore: 5,
        generosityScore: 10,
        message: "Adni menolak proyek, menghabiskan waktu dengan keluarga di restoran mewah senilai Rp 8.000.000. Keseimbangan hidup lebih berharga." 
    },
    "adni3-3": { 
        money: 0, 
        happiness: 20, 
        energy: 10, 
        social: 10,
        lifestyleScore: -2,
        mindfulnessScore: 12,
        generosityScore: 5,
        message: "Adni menegosiasi deadline lebih longgar, mendapatkan keseimbangan antara kerja dan hidup." 
    },
    
    // ========== ADNI - HARI 4 ==========
    "adni4-1": { 
        money: -20000000,       // Investasi gadget terbaru: Rp 20 juta
        happiness: 30, 
        energy: -25, 
        social: -15,
        lifestyleScore: 12,
        mindfulnessScore: -15,
        generosityScore: -8,
        message: "Adni investasi gadget terbaru senilai Rp 20.000.000, tapi teknologi cepat usang. Kebahagiaan materi bersifat sementara." 
    },
    "adni4-2": { 
        money: -12000000,       // Investasi pada acara sosial: Rp 12 juta
        happiness: 40, 
        energy: 20, 
        social: 30,
        lifestyleScore: 5,
        mindfulnessScore: 8,
        generosityScore: 15,
        message: "Adni investasi pada hubungan sosial dengan biaya Rp 12.000.000. Koneksi manusia memberi kebahagiaan yang lebih abadi." 
    },
    "adni4-3": { 
        money: 0, 
        happiness: 25, 
        energy: 15, 
        social: 20,
        lifestyleScore: -3,
        mindfulnessScore: 20,
        generosityScore: 10,
        message: "Adni investasi pada pengembangan diri. Pertumbuhan pribadi adalah sumber kebahagiaan sejati." 
    },
    
    // ========== IRMA - HARI 1 (HARGA REALISTIS) ==========
    "irma1-1": { 
        money: 0, 
        happiness: 18, 
        energy: -5, 
        social: 10,
        simplicityScore: 15,
        communityScore: 5,
        wisdomScore: 10,
        message: "Irma menghabiskan waktu di taman, menikmati alam dan ketenangan. Kesederhanaan membawa kedamaian." 
    },
    "irma1-2": { 
        money: 0, 
        happiness: 22, 
        energy: -8, 
        social: 5,
        simplicityScore: 10,
        communityScore: 15,
        wisdomScore: 12,
        message: "Irma membantu adiknya belajar. Membagikan pengetahuan memberi kepuasan yang tak ternilai." 
    },
    "irma1-3": { 
        money: -50000,          // Tiket bioskop: Rp 50.000 (realistis)
        happiness: 15, 
        energy: -5, 
        social: 8,
        simplicityScore: 5,
        communityScore: 8,
        wisdomScore: 8,
        message: "Irma menonton film di bioskop dengan biaya Rp 50.000, menikmati waktu santainya. Hiburan sederhana tetap menyenangkan." 
    },
    
    // ========== IRMA - HARI 2 (HARGA REALISTIS) ==========
    "irma2-1": { 
        money: 0, 
        happiness: 20, 
        energy: -5, 
        social: 15,
        simplicityScore: 12,
        communityScore: 20,
        wisdomScore: 10,
        message: "Irma ikut kelas memasak komunitas. Interaksi sosial langsung lebih bermakna daripada digital." 
    },
    "irma2-2": { 
        money: -100000,         // Buku resep premium: Rp 100.000 (realistis)
        happiness: 25, 
        energy: -10, 
        social: 10,
        simplicityScore: 8,
        communityScore: 5,
        wisdomScore: 15,
        message: "Irma beli buku resep premium senilai Rp 100.000 untuk belajar sendiri. Belajar mandiri mengasah kreativitas." 
    },
    "irma2-3": { 
        money: 0, 
        happiness: 30, 
        energy: 5, 
        social: 5,
        simplicityScore: 15,
        communityScore: 10,
        wisdomScore: 12,
        message: "Irma ikut hiking bersama warga. Aktivitas luar ruangan menyehatkan jiwa dan raga." 
    },
    
    // ========== IRMA - HARI 3 (HARGA REALISTIS) ==========
    "irma3-1": { 
        money: 0, 
        happiness: 25, 
        energy: -8, 
        social: 20,
        simplicityScore: 10,
        communityScore: 15,
        wisdomScore: 18,
        message: "Irma kunjungi pameran seni lokal. Mengapresiasi seni memperkaya jiwa." 
    },
    "irma3-2": { 
        money: -80000,          // Tanaman hias + pot: Rp 80.000 (realistis)
        happiness: 28, 
        energy: -5, 
        social: 15,
        simplicityScore: 12,
        communityScore: 8,
        wisdomScore: 15,
        message: "Irma beli tanaman hias dan pot senilai Rp 80.000 untuk rumah. Menciptakan lingkungan asri membawa ketenangan." 
    },
    "irma3-3": { 
        money: 0, 
        happiness: 35, 
        energy: 10, 
        social: 25,
        simplicityScore: 18,
        communityScore: 25,
        wisdomScore: 20,
        message: "Irma organisir kelas seni gratis untuk anak-anak. Berbagi ilmu memberi kebahagiaan berlipat." 
    },
    
    // ========== IRMA - HARI 4 (HARGA REALISTIS) ==========
    "irma4-1": { 
        money: 0, 
        happiness: 30, 
        energy: -10, 
        social: 20,
        simplicityScore: 15,
        communityScore: 20,
        wisdomScore: 18,
        message: "Irma hadiri konser musik akustik komunitas. Seni lokal memperkaya budaya." 
    },
    "irma4-2": { 
        money: -120000,         // Alat musik sederhana: Rp 120.000 (realistis)
        happiness: 32, 
        energy: -8, 
        social: 18,
        simplicityScore: 10,
        communityScore: 12,
        wisdomScore: 20,
        message: "Irma beli alat musik sederhana senilai Rp 120.000 untuk mengembangkan bakat. Investasi pada hobi mengembangkan potensi." 
    },
    "irma4-3": { 
        money: 0, 
        happiness: 40, 
        energy: 15, 
        social: 30,
        simplicityScore: 20,
        communityScore: 30,
        wisdomScore: 25,
        message: "Irma mengajar kelas seni gratis untuk anak-anak. Warisan terbaik adalah pengetahuan yang dibagikan." 
    }
};

// =============================================
// TIPE ENDING DAN PESAN
// =============================================

const EndingMessages = {
    adni: {
        // Berdasarkan kombinasi skor
        MATERIALISTIC: {
            title: "✨ RAJA KONSUMTIF ✨",
            subtitle: "Budak Teknologi, Tuan Materi",
            description: "Anda telah menjadi ikon konsumerisme era digital. Hidup dikelilingi gadget terbaru, pakaian desainer, dan kemewahan duniawi. Tapi di balik gemerlap itu, hati terasa hampa.",
            insights: [
                "💰 Uang habis Rp 68+ juta untuk kepuasan instan",
                "📱 Terjebak dalam siklus upgrade teknologi tak berujung",
                "😔 Kebahagiaan bersifat sementara seperti baterai smartphone",
                "🌙 Malam-malam dihabiskan scrolling online shop"
            ],
            quote: "Uang bisa membeli kebahagiaan, tapi hanya yang bertahan hingga baterai habis."
        },
        BALANCED: {
            title: "⚖️ PENJELAJAH SEIMBANG ⚖️",
            subtitle: "Bijak di Antara Dua Dunia",
            description: "Anda menemukan sweet spot antara menikmati kemajuan teknologi dan menjaga nilai-nilai manusiawi. Bisa menikmati kopi mahal tapi juga bersedekah, bisa pakai gadget canggih tapi tetap bertemu keluarga.",
            insights: [
                "🤝 Investasi terbesar pada hubungan sosial",
                "🧘‍♂️ Menjaga mindfulness di tengah notifikasi",
                "💡 Memilih kapan harus online dan offline",
                "🎯 Fokus pada pengalaman bermakna, bukan hanya barang"
            ],
            quote: "Kebahagiaan sejati adalah playlist yang tepat antara lagu materi dan lagu jiwa."
        },
        MINDFUL: {
            title: "🌿 PENCARI MAKNA 🌿",
            subtitle: "Dari Konsumsi ke Kontemplasi",
            description: "Anda memilih jalan kesadaran. Daripada membeli kebahagiaan, Anda menciptakannya dari dalam. Meditasi menggantikan shopping, self-reflection menggantikan social comparison.",
            insights: [
                "🪷 Uang tersisa banyak karena minim konsumsi impulsif",
                "🧠 Investasi pada pengembangan diri dan mindfulness",
                "🌅 Menemukan keindahan dalam kesederhanaan",
                "💫 Kebahagiaan datang dari dalam, bukan dari luar"
            ],
            quote: "Notifikasi terpenting berasal dari hati nurani, bukan dari smartphone."
        },
        PHILANTHROPIC: {
            title: "🤲 SANG PEMBAGI 🤲",
            subtitle: "Kekayaan untuk Kebaikan Bersama",
            description: "Rp 100 juta tidak dihabiskan untuk diri sendiri, tapi menjadi berkah bagi banyak orang. Anda menemukan bahwa berbagi memberi kepuasan yang lebih dalam daripada memiliki.",
            insights: [
                "❤️‍🔥 Kebahagiaan meningkat seiring dengan kedermawanan",
                "👥 Jaringan sosial berkembang melalui kontribusi",
                "🌱 Uang menjadi alat perubahan, bukan tujuan",
                "✨ Legacy lebih berharga daripada luxury"
            ],
            quote: "Rekening bank penuh tidak sebanding dengan hati yang penuh makna."
        }
    },
    
    irma: {
        URBAN_SAGE: {
            title: "🏙️ SAGE KOTA 🏙️",
            subtitle: "Bijaksana di Tengah Gemuruh Digital",
            description: "Dengan uang terbatas, Anda justru menemukan kekayaan tak terhingga. Setiap hari adalah pelajaran tentang arti hidup sebenarnya di era yang serba cepat.",
            insights: [
                "🌳 Menemukan oasis ketenangan di kota metropolitan",
                "📚 Perpustakaan dan taman menjadi tempat favorit",
                "👨‍👩‍👧‍👦 Komunitas adalah extended family",
                "🎨 Kreativitas tumbuh dalam keterbatasan"
            ],
            quote: "Kebahagiaan tidak memerlukan WiFi, hanya butuh kehadiran."
        },
        COMMUNITY_BUILDER: {
            title: "👑 RATU KOMUNITAS 👑",
            subtitle: "Jantung dari Jaringan Manusia",
            description: "Rumah Anda adalah pusat kegiatan, uang Rp 200.000 menjadi katalisator untuk membangun ikatan sosial. Dari kelas memasak hingga kelompok seni, Anda menciptakan ruang untuk manusia bertemu manusia.",
            insights: [
                "🤝 Setiap rupiah diinvestasikan pada hubungan",
                "🎪 Menciptakan ruang bersama tanpa biaya mahal",
                "👥 Social capital lebih berharga dari financial capital",
                "💞 Kebahagiaan datang dari memberi, bukan menerima"
            ],
            quote: "Komunitas terkuat dibangun bukan dengan uang, tapi dengan perhatian."
        },
        MINIMALIST_GURU: {
            title: "🎓 GURU MINIMALIS 🎓",
            subtitle: "Mengajar dengan Contoh Hidup",
            description: "Sebagai guru, Anda tidak hanya mengajar mata pelajaran, tapi juga pelajaran hidup. Kelas Anda adalah laboratorium bagaimana hidup bermakna tanpa terikat pada materi.",
            insights: [
                "✏️ Setiap interaksi adalah kesempatan mengajar dan belajar",
                "🌱 Hidup sesuai dengan nilai yang diajarkan",
                "📉 Uang sedikit, tetapi pengalaman berlimpah",
                "🎯 Fokus pada yang esensial, hilangkan yang berlebihan"
            ],
            quote: "Gaji terbesar seorang guru adalah melihat muridnya bahagia."
        },
        WISDOM_SEEKER: {
            title: "🔍 PENJELAJAH KEBENARAN 🔍",
            subtitle: "Dari Konsumsi ke Kebijaksanaan",
            description: "Perjalanan 4 hari membawa Anda pada penemuan bahwa Revolusi Industri 4.0 bukan tentang memiliki lebih banyak, tapi tentang memahami lebih dalam. Uang bukan alat konsumsi, tapi alat belajar.",
            insights: [
                "🧭 Setiap keputusan adalah pelajaran hidup",
                "📖 Buku dan alam adalah guru terbaik",
                "💭 Refleksi lebih berharga dari refleksi di kaca toko",
                "🌌 Kebahagiaan ditemukan dalam kedalaman, bukan kelimpahan"
            ],
            quote: "Di era algoritma, kebijaksanaan manusia adalah sistem operasi terbaik."
        }
    }
};

// =============================================
// FUNGSI ANALISIS ENDING
// =============================================

function analyzeEnding() {
    if (!GameState.currentCharacter) return null;
    
    const character = GameState.currentCharacter;
    const stats = GameState[character];
    
    // Hitung skor total untuk tiap dimensi
    let endingType = '';
    
    if (character === 'adni') {
        const totalSpent = 100000000 - stats.money;
        const lifestyleScore = Math.max(0, Math.min(100, stats.lifestyleScore + 50));
        const mindfulnessScore = Math.max(0, Math.min(100, stats.mindfulnessScore + 50));
        const generosityScore = Math.max(0, Math.min(100, stats.generosityScore + 50));
        
        // Tentukan ending berdasarkan dominasi skor
        if (lifestyleScore > 70 && mindfulnessScore < 40 && generosityScore < 40) {
            endingType = 'MATERIALISTIC';
        } else if (generosityScore > 70 && lifestyleScore < 50) {
            endingType = 'PHILANTHROPIC';
        } else if (mindfulnessScore > 70 && lifestyleScore < 40) {
            endingType = 'MINDFUL';
        } else {
            endingType = 'BALANCED';
        }
        
        // Tambahkan data analisis untuk ditampilkan
        stats.endingAnalysis = {
            type: endingType,
            totalMoneySpent: totalSpent,
            lifestylePercentage: lifestyleScore,
            mindfulnessPercentage: mindfulnessScore,
            generosityPercentage: generosityScore,
            primaryFocus: getHighestScore([lifestyleScore, mindfulnessScore, generosityScore])
        };
        
    } else { // irma
        const totalSpent = 200000 - stats.money;
        const simplicityScore = Math.max(0, Math.min(100, stats.simplicityScore + 50));
        const communityScore = Math.max(0, Math.min(100, stats.communityScore + 50));
        const wisdomScore = Math.max(0, Math.min(100, stats.wisdomScore + 50));
        
        // Tentukan ending berdasarkan dominasi skor
        if (simplicityScore > 70 && communityScore < 50) {
            endingType = 'MINIMALIST_GURU';
        } else if (communityScore > 70 && wisdomScore < 50) {
            endingType = 'COMMUNITY_BUILDER';
        } else if (wisdomScore > 70 && simplicityScore < 50) {
            endingType = 'WISDOM_SEEKER';
        } else {
            endingType = 'URBAN_SAGE';
        }
        
        stats.endingAnalysis = {
            type: endingType,
            totalMoneySpent: totalSpent,
            simplicityPercentage: simplicityScore,
            communityPercentage: communityScore,
            wisdomPercentage: wisdomScore,
            primaryFocus: getHighestScore([simplicityScore, communityScore, wisdomScore])
        };
    }
    
    return EndingMessages[character][endingType];
}

function getHighestScore(scores) {
    const maxScore = Math.max(...scores);
    const index = scores.indexOf(maxScore);
    const labels = ['Material', 'Kesadaran', 'Kedermawanan'];
    return labels[index] || 'Seimbang';
}

// =============================================
// FUNGSI UTILITAS GAME STATE
// =============================================

/**
 * Format angka menjadi format mata uang Indonesia
 * @param {number} amount - Jumlah uang
 * @returns {string} Uang dalam format Rp
 */
function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Menghitung progress persentase berdasarkan hari saat ini
 * @returns {number} Persentase progress (0-100)
 */
function calculateProgress() {
    if (GameState.day && GameState.maxDays) {
        // Progress dihitung berdasarkan hari yang sudah dilewati
        // Hari 1: 0%, Hari 2: 33%, Hari 3: 66%, Hari 4: 100%
        return ((GameState.day - 1) / (GameState.maxDays - 1)) * 100;
    }
    return 0;
}

/**
 * Mendapatkan scene berikutnya berdasarkan state saat ini
 * @returns {string} Nama file HTML scene berikutnya atau ending
 */
function getNextScene() {
    // Tambah hari dan scene
    GameState.day++;
    GameState.currentScene++;
    
    console.log(`Moving to Day ${GameState.day}, Scene ${GameState.currentScene}`);
    
    // Jika sudah melewati hari terakhir, pergi ke ending
    if (GameState.day > GameState.totalDays) {
        return 'ending.html';
    } else {
        // Format: character-sceneX.html
        return `${GameState.currentCharacter}-scene${GameState.currentScene}.html`;
    }
}

/**
 * Menyimpan state game ke localStorage
 */
function saveGameState() {
    try {
        localStorage.setItem('thqGameState', JSON.stringify(GameState));
        console.log('Game state saved:', GameState);
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

/**
 * Memuat state game dari localStorage
 * @returns {boolean} true jika berhasil, false jika tidak
 */
function loadGameState() {
    try {
        const saved = localStorage.getItem('thqGameState');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Update GameState dengan data yang disimpan
            Object.assign(GameState, parsed);
            
            console.log('Game state loaded:', GameState);
            return true;
        }
    } catch (error) {
        console.error('Error loading game state:', error);
    }
    return false;
}

/**
 * Memeriksa apakah karakter bisa memilih opsi berdasarkan uang yang dibutuhkan
 * @param {string} character - Nama karakter ('adni' atau 'irma')
 * @param {Object} effects - Efek pilihan
 * @returns {boolean} true jika bisa memilih, false jika tidak
 */
function canAffordChoice(character, effects) {
    const characterData = GameState[character];
    
    // Jika efek membutuhkan uang (nilai negatif)
    if (effects.money < 0) {
        // Hitung apakah uang cukup setelah dikurangi biaya
        const remainingMoney = characterData.money + effects.money;
        
        // Jika uang tidak cukup (kurang dari 0 setelah transaksi)
        if (remainingMoney < 0) {
            console.log(`${character} tidak bisa memilih: butuh ${Math.abs(effects.money)} uang, hanya punya ${characterData.money}`);
            return false;
        }
    }
    
    return true;
}

/**
 * Menerapkan efek pilihan pada karakter
 * @param {Object} character - Objek karakter (adni atau irma)
 * @param {Object} effects - Efek yang akan diterapkan
 * @returns {string} Pesan hasil pilihan
 */
function applyEffects(character, effects) {
    console.log(`Applying effects for ${GameState.currentCharacter}:`, effects);
    
    // Simpan nilai lama untuk debugging
    const oldStats = {
        money: character.money,
        happiness: character.happiness,
        energy: character.energy,
        social: character.social
    };
    
    // Terapkan efek dasar
    character.money += effects.money;
    character.happiness += effects.happiness;
    character.energy += effects.energy;
    character.social += effects.social;
    
    // Terapkan efek skor untuk ending
    if (GameState.currentCharacter === 'adni') {
        character.lifestyleScore += effects.lifestyleScore || 0;
        character.mindfulnessScore += effects.mindfulnessScore || 0;
        character.generosityScore += effects.generosityScore || 0;
    } else {
        character.simplicityScore += effects.simplicityScore || 0;
        character.communityScore += effects.communityScore || 0;
        character.wisdomScore += effects.wisdomScore || 0;
    }
    
    // Pastikan nilai tidak melebihi batas
    character.money = Math.max(0, character.money);
    character.happiness = Math.max(0, Math.min(100, character.happiness));
    character.energy = Math.max(0, Math.min(100, character.energy));
    character.social = Math.max(0, Math.min(100, character.social));
    
    // Tambahkan ke riwayat pilihan
    GameState.choicesHistory.push({
        day: GameState.day,
        choice: effects.message,
        effects: effects
    });
    
    console.log(`Stats updated from ${JSON.stringify(oldStats)} to ${JSON.stringify(character)}`);
    return effects.message;
}

/**
 * Mereset game ke state awal
 */
function resetGame() {
    console.log('Resetting game to initial state');
    
    GameState.currentCharacter = null;
    GameState.currentScene = 1;
    GameState.day = 1;
    GameState.choicesHistory = [];
    GameState.isProcessing = false;
    
    // Reset stat Adni - UANG BESAR KEMBALI (Rp 100 JUTA)
    GameState.adni = {
        money: 100000000,
        happiness: 50,
        energy: 70,
        social: 30,
        canSpendMoney: true,
        lifestyleScore: 0,
        mindfulnessScore: 0,
        generosityScore: 0
    };
    
    // Reset stat Irma - UANG TERBATAS KEMBALI (Rp 200.000)
    GameState.irma = {
        money: 200000,
        happiness: 75,
        energy: 85,
        social: 80,
        canSpendMoney: true,
        simplicityScore: 0,
        communityScore: 0,
        wisdomScore: 0
    };
    
    saveGameState();
}

/**
 * Setup scene secara otomatis
 * Ini harus dipanggil di setiap scene HTML
 */
function setupScene() {
    // Deteksi mobile
    detectMobile();
    setupMobileOptimization();
    
    // Muat state game
    loadGameState();
    
    // Setup progress bar dan day indicator
    const progressBar = document.getElementById('progressBar');
    const dayIndicator = document.querySelector('.day-indicator');
    
    // Update progress bar jika ada
    if (progressBar) {
        const progressPercentage = calculateProgress();
        progressBar.style.width = `${progressPercentage}%`;
        console.log(`Progress bar set to ${progressPercentage}%`);
    }
    
    // Update day indicator jika ada
    if (dayIndicator) {
        dayIndicator.textContent = `Hari ${GameState.day}`;
    }
    
    // Update stat display untuk karakter yang sedang aktif
    if (GameState.currentCharacter) {
        const characterData = GameState[GameState.currentCharacter];
        
        // Format uang untuk tampilan
        let moneyDisplay = formatMoney(characterData.money);
        
        // Update elemen stat jika ada di halaman
        const moneyElement = document.getElementById(`${GameState.currentCharacter}Money`);
        const happinessElement = document.getElementById(`${GameState.currentCharacter}Happiness`);
        const energyElement = document.getElementById(`${GameState.currentCharacter}Energy`);
        const socialElement = document.getElementById(`${GameState.currentCharacter}Social`);
        
        if (moneyElement) moneyElement.textContent = moneyDisplay;
        if (happinessElement) happinessElement.textContent = characterData.happiness;
        if (energyElement) energyElement.textContent = characterData.energy;
        if (socialElement) socialElement.textContent = characterData.social;
        
        console.log(`Stats displayed for ${GameState.currentCharacter}:`, characterData);
    }
    
    // Setup event listeners untuk mobile
    setupMobileEventListeners();
    
    // Log untuk debugging
    console.log(`Scene setup complete: ${GameState.currentCharacter}, Day ${GameState.day}, Scene ${GameState.currentScene}`);
    
    // Tampilkan peringatan jika Irma tidak punya uang
    if (GameState.currentCharacter === 'irma' && GameState.irma.money <= 0) {
        console.log("⚠ PERHATIAN: Uang Irma telah habis! Hanya opsi gratis yang tersedia.");
    }
}

/**
 * Setup event listeners untuk mobile
 */
function setupMobileEventListeners() {
    // Setup untuk tombol pilihan (choice buttons)
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    choiceButtons.forEach(button => {
        if (GameState.isMobile) {
            // Untuk mobile, tambahkan touch event
            button.addEventListener('touchstart', handleChoiceTouchStart, { passive: true });
            button.addEventListener('touchend', handleChoiceTouchEnd, { passive: true });
            button.addEventListener('touchcancel', handleChoiceTouchCancel, { passive: true });
            
            // Juga tambahkan click untuk fallback
            button.addEventListener('click', handleChoiceClick);
        } else {
            // Untuk desktop, hanya gunakan click
            button.addEventListener('click', handleChoiceClick);
        }
    });
    
    // Setup untuk tombol lainnya (start, select, restart)
    const actionButtons = document.querySelectorAll('.start-btn, .select-btn, .restart-btn');
    
    actionButtons.forEach(button => {
        if (GameState.isMobile) {
            button.addEventListener('touchstart', handleButtonTouchStart, { passive: true });
            button.addEventListener('touchend', handleButtonTouchEnd, { passive: true });
            button.addEventListener('touchcancel', handleButtonTouchCancel, { passive: true });
            button.addEventListener('click', handleButtonClick);
        } else {
            button.addEventListener('click', handleButtonClick);
        }
    });
    
    console.log(`Mobile event listeners setup: ${choiceButtons.length} choice buttons, ${actionButtons.length} action buttons`);
}

/**
 * Handle touch start untuk choice buttons
 */
function handleChoiceTouchStart(e) {
    if (GameState.isProcessing) {
        e.preventDefault();
        return;
    }
    
    const button = e.currentTarget;
    if (!button.disabled && !button.classList.contains('selected')) {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
    }
}

/**
 * Handle touch end untuk choice buttons
 */
function handleChoiceTouchEnd(e) {
    const button = e.currentTarget;
    if (!button.disabled && !button.classList.contains('selected')) {
        button.style.transform = '';
        button.style.opacity = '';
        
        // Trigger click setelah touch end
        if (!GameState.isProcessing) {
            GameState.isProcessing = true;
            setTimeout(() => {
                handleChoiceClick.call(button, e);
                GameState.isProcessing = false;
            }, 100);
        }
    }
}

/**
 * Handle touch cancel untuk choice buttons
 */
function handleChoiceTouchCancel(e) {
    const button = e.currentTarget;
    button.style.transform = '';
    button.style.opacity = '';
}

/**
 * Handle click untuk choice buttons
 */
function handleChoiceClick(e) {
    if (GameState.isProcessing) return;
    
    const button = e.currentTarget || this;
    
    // Cek apakah sudah dipilih atau disabled
    if (button.disabled || button.classList.contains('selected')) {
        return;
    }
    
    // Cek apakah bisa membayar
    const choiceId = button.dataset.choice;
    if (!choiceId) return;
    
    const effects = ChoiceEffects[choiceId];
    if (!effects) return;
    
    // Untuk Irma, cek apakah uang cukup
    if (GameState.currentCharacter === 'irma' && effects.money < 0) {
        if (!canAffordChoice('irma', effects)) {
            // Tampilkan pesan bahwa uang tidak cukup
            showMobileToast("Uang tidak cukup untuk pilihan ini!");
            return;
        }
    }
    
    GameState.isProcessing = true;
    
    // Tampilkan loading state
    button.classList.add('processing');
    
    // Seleksi tombol
    const allButtons = document.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected');
    });
    
    button.classList.add('selected');
    
    // Terapkan efek pilihan
    const character = GameState.currentCharacter;
    const characterData = GameState[character];
    const message = applyEffects(characterData, effects);
    
    // Update tampilan stat
    updateStatsDisplay();
    
    // Tampilkan pesan hasil pilihan
    showChoiceMessage(message);
    
    // Simpan state
    saveGameState();
    
    // Set timeout untuk lanjut ke scene berikutnya
    setTimeout(() => {
        const nextScene = getNextScene();
        if (nextScene === 'ending.html') {
            // Untuk ending, langsung redirect
            window.location.href = nextScene;
        } else {
            // Untuk scene biasa, tampilkan tombol lanjut
            showContinueButton();
        }
        GameState.isProcessing = false;
    }, GameState.isMobile ? 1500 : 2000);
}

/**
 * Handle touch start untuk action buttons
 */
function handleButtonTouchStart(e) {
    const button = e.currentTarget;
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.8';
}

/**
 * Handle touch end untuk action buttons
 */
function handleButtonTouchEnd(e) {
    const button = e.currentTarget;
    button.style.transform = '';
    button.style.opacity = '';
    
    // Trigger click
    setTimeout(() => {
        handleButtonClick.call(button, e);
    }, 50);
}

/**
 * Handle touch cancel untuk action buttons
 */
function handleButtonTouchCancel(e) {
    const button = e.currentTarget;
    button.style.transform = '';
    button.style.opacity = '';
}

/**
 * Handle click untuk action buttons
 */
function handleButtonClick(e) {
    const button = e.currentTarget || this;
    const action = button.dataset.action;
    
    switch(action) {
        case 'start':
            window.location.href = 'character-select.html';
            break;
        case 'select-adni':
            GameState.currentCharacter = 'adni';
            GameState.currentScene = 1;
            GameState.day = 1;
            saveGameState();
            window.location.href = 'adni-scene1.html';
            break;
        case 'select-irma':
            GameState.currentCharacter = 'irma';
            GameState.currentScene = 1;
            GameState.day = 1;
            saveGameState();
            window.location.href = 'irma-scene1.html';
            break;
        case 'continue':
            const nextScene = getNextScene();
            window.location.href = nextScene;
            break;
        case 'restart':
            resetGame();
            window.location.href = 'index.html';
            break;
        default:
            console.log('Unknown button action:', action);
    }
}

/**
 * Update tampilan stat dengan animasi
 */
function updateStatsDisplay() {
    if (!GameState.currentCharacter) return;
    
    const character = GameState.currentCharacter;
    const characterData = GameState[character];
    
    // Format uang untuk tampilan
    const moneyDisplay = formatMoney(characterData.money);
    
    // Update elemen stat
    const moneyElement = document.getElementById(`${character}Money`);
    const happinessElement = document.getElementById(`${character}Happiness`);
    const energyElement = document.getElementById(`${character}Energy`);
    const socialElement = document.getElementById(`${character}Social`);
    
    // Fungsi helper untuk animasi update
    function animateStatUpdate(element, newValue) {
        if (element && element.textContent !== newValue.toString()) {
            element.classList.remove('stat-update');
            void element.offsetWidth; // Trigger reflow
            element.textContent = newValue;
            element.classList.add('stat-update');
            
            // Hapus class setelah animasi selesai
            setTimeout(() => {
                element.classList.remove('stat-update');
            }, 600);
        }
    }
    
    // Update dengan animasi
    if (moneyElement) animateStatUpdate(moneyElement, moneyDisplay);
    if (happinessElement) animateStatUpdate(happinessElement, characterData.happiness);
    if (energyElement) animateStatUpdate(energyElement, characterData.energy);
    if (socialElement) animateStatUpdate(socialElement, characterData.social);
}

/**
 * Tampilkan pesan hasil pilihan
 */
function showChoiceMessage(message) {
    // Hapus pesan sebelumnya jika ada
    const existingMessage = document.querySelector('.choice-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Buat elemen pesan baru
    const messageDiv = document.createElement('div');
    messageDiv.className = 'choice-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    // Tambahkan ke DOM
    const sceneText = document.querySelector('.scene-text');
    if (sceneText) {
        sceneText.appendChild(messageDiv);
        
        // Scroll ke pesan pada mobile
        if (GameState.isMobile) {
            setTimeout(() => {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }
}

/**
 * Tampilkan tombol lanjut
 */
function showContinueButton() {
    // Hapus tombol lanjut sebelumnya jika ada
    const existingButton = document.querySelector('.continue-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Buat tombol lanjut
    const continueButton = document.createElement('button');
    continueButton.className = 'continue-btn start-btn';
    continueButton.dataset.action = 'continue';
    continueButton.innerHTML = `
        <span>Lanjutkan</span>
        <span class="btn-sparkle"></span>
    `;
    
    // Tambahkan event listener
    if (GameState.isMobile) {
        continueButton.addEventListener('touchstart', handleButtonTouchStart, { passive: true });
        continueButton.addEventListener('touchend', handleButtonTouchEnd, { passive: true });
        continueButton.addEventListener('touchcancel', handleButtonTouchCancel, { passive: true });
        continueButton.addEventListener('click', handleButtonClick);
    } else {
        continueButton.addEventListener('click', handleButtonClick);
    }
    
    // Tambahkan ke DOM
    const sceneText = document.querySelector('.scene-text');
    if (sceneText) {
        sceneText.appendChild(continueButton);
        
        // Scroll ke tombol pada mobile
        if (GameState.isMobile) {
            setTimeout(() => {
                continueButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }
}

/**
 * Tampilkan toast message untuk mobile
 */
function showMobileToast(message, duration = 2000) {
    // Hapus toast sebelumnya jika ada
    const existingToast = document.getElementById('mobile-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Buat toast
    const toast = document.createElement('div');
    toast.id = 'mobile-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: var(--yellow-primary);
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 99999;
        font-size: 14px;
        white-space: nowrap;
        border: 1px solid var(--yellow-primary);
        backdrop-filter: blur(10px);
        animation: toastFadeIn 0.3s ease;
    `;
    
    // Tambahkan style untuk animasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastFadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastFadeOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Hapus toast setelah duration
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 300);
    }, duration);
}

/**
 * Setup loading screen untuk mobile
 */
function setupLoadingScreen() {
    // Buat loading screen jika belum ada
    if (!document.getElementById('loading-screen')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.className = 'loading';
        loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingScreen);
    }
    
    // Sembunyikan loading screen setelah halaman selesai load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                }, 300);
            }
        }, 500);
    });
}

/**
 * Setup viewport height untuk mobile
 */
function setupViewportHeight() {
    if (GameState.isMobile) {
        // Set viewport height untuk mobile
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
}

// =============================================
// INISIALISASI SAAT HALAMAN DIMUAT
// =============================================

// Setup loading screen
setupLoadingScreen();

// Setup viewport height untuk mobile
setupViewportHeight();

// Deteksi mobile saat pertama kali load
detectMobile();

// =============================================
// EKSPOR FUNGSI UNTUK DIGUNAKAN DI HTML
// =============================================

// Jika menggunakan module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameState,
        ChoiceEffects,
        EndingMessages,
        formatMoney,
        calculateProgress,
        getNextScene,
        saveGameState,
        loadGameState,
        canAffordChoice,
        applyEffects,
        resetGame,
        setupScene,
        analyzeEnding,
        detectMobile,
        setupMobileOptimization
    };
}