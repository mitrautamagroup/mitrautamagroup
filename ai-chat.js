/**
 * ASISTEN KENCANA AI — Firebase Auth + Firestore + Gemini
 * =========================================================
 * User WAJIB login Google sebelum bisa chat dengan AI.
 * Semua percakapan tersimpan otomatis di Firestore.
 * Admin bisa lihat data user di Firebase Console.
 *
 * SETUP (isi nilai di bawah ini):
 * 1. GEMINI_API_KEY   → https://aistudio.google.com/app/apikey
 * 2. firebaseConfig   → Firebase Console > Project Settings > Your apps
 * 3. Di Firebase Console: aktifkan Authentication > Google provider
 * 4. Di Firebase Console: buat Firestore Database (mode: production)
 */

// ==========================================
// 🔑 KONFIGURASI — ISI NILAI INI
// ==========================================

const GEMINI_API_KEY = 'MASUKKAN_GEMINI_API_KEY_ANDA'; // https://aistudio.google.com/app/apikey

const firebaseConfig = {
  apiKey:            "MASUKKAN_FIREBASE_API_KEY",
  authDomain:        "MASUKKAN.firebaseapp.com",
  projectId:         "MASUKKAN_PROJECT_ID",
  storageBucket:     "MASUKKAN.appspot.com",
  messagingSenderId: "MASUKKAN_SENDER_ID",
  appId:             "MASUKKAN_APP_ID"
};

// ==========================================
// FIREBASE SDK (loaded via CDN in index.html)
// ==========================================
import { initializeApp }                              from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp, increment, updateDoc } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';

const app   = initializeApp(firebaseConfig);
const auth  = getAuth(app);
const db    = getFirestore(app);

// ==========================================
// GEMINI CONFIG
// ==========================================
const GEMINI_MODEL   = 'gemini-2.0-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ==========================================
// SYSTEM PROMPT — Pengetahuan Bisnis Lengkap
// ==========================================
const SYSTEM_PROMPT = `
Kamu adalah "Asisten Kencana AI", asisten virtual resmi milik Gebyok Kencana Jati Jepara yang dikelola oleh Mitra Utama Group. 
Tugasmu adalah membantu calon pembeli dan pelanggan menjawab semua pertanyaan seputar produk, harga, pemesanan, pengiriman, dan layanan kami.

=== PROFIL PERUSAHAAN ===
Nama Perusahaan: Gebyok Kencana Jati Jepara — Mitra Utama Group
Email: mitrautama.info@gmail.com
WhatsApp: 0812-3456-7890
Alamat Workshop: Jl. Raya Jepara - Kudus Km. 9, Tahunan, Jepara, Jawa Tengah 59427
Jam Operasional: Senin - Minggu pukul 08.00 - 21.00 WIB
Website: https://mitrautamagroup.github.io
Pengalaman: Lebih dari 35 tahun di bidang seni ukir kayu jati Jepara & Kudus
Produk terpasang: Lebih dari 2.800 unit di seluruh Indonesia

=== PRODUK & KOLEKSI ===

1. PINTU GEBYOK KUDUSAN MAHKOTA GUNUNGAN 3 DIMENSI
   - Tipe: Pintu Utama / Fasad Joglo & Hunian Modern
   - Deskripsi: Ukiran relief tembus 3D khas Kudus dengan ornamen Gunungan Wayang dan lung-lungan.
   - Dimensi Standar: Lebar 300 cm, Tinggi 275 cm (custom bisa s/d 600 cm)
   - Harga Normal: Rp 26.500.000 | Harga Promo: Rp 19.800.000
   - Bonus: Handle pintu kuningan antik ukir + palet kayu ekspor

2. GEBYOK PELAMINAN MEGAH UKIR BUNGA & RELIEF KARAWANGAN
   - Tipe: Dekorasi Pelaminan & Wedding Stage
   - Dimensi: Lebar 600-800 cm (6 panel knockdown), Tinggi 280 cm
   - Harga Normal: Rp 42.000.000 | Harga Promo: Rp 32.500.000

3. PARTISI SKETSEL GEBYOK PENYEKAT RUANG MODERN
   - Tipe: Partisi Interior / Pembatas Ruang
   - Dimensi: Lebar 200-250 cm, Tinggi 240 cm
   - Harga Normal: Rp 17.500.000 | Harga Promo: Rp 13.900.000

4. GEBYOK ROYAL JEPARA KALIGRAFI & RELIEF LUNG FLORAL
   - Tipe: Pintu Utama Luxury / Fasad Villa & Resort
   - Dimensi: Lebar 350 cm, Tinggi 280 cm
   - Harga Normal: Rp 31.000.000 | Harga Promo: Rp 23.500.000

=== BAHAN & KUALITAS ===
- Kayu Jati Grade A Super (TPK Perhutani tua >40 tahun), kering oven MC<12%
- Kayu Jati Grade B: Jati kampung merah pilihan
- Semua kayu bersertifikat SVLK
- Garansi resmi 10 tahun untuk Jati TPK Grade A

=== WAKTU PENGERJAAN ===
- Stok mentahan: 7-14 hari | Custom standar: 14-21 hari | Custom besar: 25-45 hari

=== PENGIRIMAN ===
- Jawa & Bali: Truk khusus mebel + tim pasang (GRATIS PASANG)
- Luar Pulau: Packing palet + asuransi kargo

=== PANDUAN MENJAWAB ===
- Jawab dalam Bahasa Indonesia yang ramah, hangat, dan profesional
- Gunakan emoji yang relevan (🪵 🚪 💰 ✅ 🚚 📞)
- Selalu akhiri jawaban harga/pemesanan dengan ajakan hubungi WA: 0812-3456-7890
- Maksimal 200 kata per respons
`;

// ==========================================
// STATE
// ==========================================
let currentUser    = null;
let chatHistory    = [];
let isTyping       = false;
let currentChatRef = null;

// ==========================================
// DOM ELEMENTS
// ==========================================
const wrapper      = document.getElementById('aiChatWrapper');
const toggleBtn    = document.getElementById('aiChatToggle');
const panel        = document.getElementById('aiChatPanel');
const messagesArea = document.getElementById('aiMessagesArea');
const inputEl      = document.getElementById('aiInput');
const sendBtn      = document.getElementById('aiSendBtn');
const clearBtn     = document.getElementById('aiClearBtn');
const closeBtn     = document.getElementById('aiClosePanelBtn');
const quickChips   = document.getElementById('aiQuickChips');

// ==========================================
// CHECK CONFIG
// ==========================================
function isFirebaseConfigured() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('MASUKKAN');
}
function isGeminiConfigured() {
  return GEMINI_API_KEY && !GEMINI_API_KEY.includes('MASUKKAN');
}

// ==========================================
// OPEN / CLOSE PANEL
// ==========================================
function openPanel() {
  wrapper.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  if (currentUser && inputEl) inputEl.focus();
}
function closePanel() {
  wrapper.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

toggleBtn && toggleBtn.addEventListener('click', () => {
  wrapper.classList.contains('open') ? closePanel() : openPanel();
});
closeBtn && closeBtn.addEventListener('click', closePanel);

// ==========================================
// AUTH STATE LISTENER
// ==========================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await saveUserToFirestore(user);
    showChatInterface(user);
  } else {
    currentUser = null;
    showLoginScreen();
  }
});

// ==========================================
// SAVE USER TO FIRESTORE
// ==========================================
async function saveUserToFirestore(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid:          user.uid,
      name:         user.displayName,
      email:        user.email,
      photo:        user.photoURL,
      lastSeen:     serverTimestamp(),
      firstLogin:   serverTimestamp(),
    }, { merge: true }); // merge: true — jangan timpa data existing
  } catch (err) {
    console.error('Error saving user:', err);
  }
}

// ==========================================
// SHOW LOGIN SCREEN
// ==========================================
function showLoginScreen() {
  if (!messagesArea) return;

  messagesArea.innerHTML = `
    <div class="ai-login-screen">
      <div class="ai-login-icon">🤖</div>
      <h3 class="ai-login-title">Asisten Kencana AI</h3>
      <p class="ai-login-desc">Login dengan akun Google Anda untuk mulai bertanya tentang produk Gebyok Kencana Jati Jepara.</p>
      <button class="ai-google-btn" id="aiGoogleLoginBtn">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
        <span>Login dengan Google</span>
      </button>
      <p class="ai-login-note">🔒 Data Anda aman & tidak dibagikan ke pihak ketiga</p>
    </div>
  `;

  // Disable input area
  if (inputEl) { inputEl.disabled = true; inputEl.placeholder = 'Login Google dulu untuk mulai chat...'; }
  if (sendBtn) sendBtn.disabled = true;
  if (quickChips) quickChips.style.display = 'none';

  // Attach login button
  const loginBtn = document.getElementById('aiGoogleLoginBtn');
  loginBtn && loginBtn.addEventListener('click', loginWithGoogle);

  // Check config
  if (!isFirebaseConfigured() || !isGeminiConfigured()) {
    const screen = messagesArea.querySelector('.ai-login-screen');
    if (screen) {
      screen.insertAdjacentHTML('beforeend', `
        <div class="ai-apikey-warn" style="margin-top:12px">
          <strong>⚠️ Konfigurasi Belum Lengkap</strong>
          <span>Isi Firebase Config & Gemini API Key di file <code>ai-chat.js</code></span>
          <a href="https://aistudio.google.com/app/apikey" target="_blank">🔑 Dapatkan Gemini API Key Gratis →</a>
        </div>
      `);
    }
    if (loginBtn) loginBtn.disabled = true;
  }
}

// ==========================================
// SHOW CHAT INTERFACE (after login)
// ==========================================
function showChatInterface(user) {
  if (!messagesArea) return;

  // Update header to show user info
  const headerLeft = panel && panel.querySelector('.ai-header-left');
  if (headerLeft) {
    headerLeft.innerHTML = `
      <img src="${user.photoURL || 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'}"
           alt="${user.displayName}"
           style="width:38px;height:38px;border-radius:50%;border:2px solid rgba(255,255,255,0.4);object-fit:cover">
      <div class="ai-header-info">
        <span class="ai-name">Halo, ${user.displayName?.split(' ')[0]} 👋</span>
        <span class="ai-status"><span class="ai-status-dot"></span>Asisten Kencana AI Siap</span>
      </div>
    `;
  }

  // Add logout button to header actions
  const headerActions = panel && panel.querySelector('.ai-header-actions');
  if (headerActions && !headerActions.querySelector('#aiLogoutBtn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'ai-clear-btn';
    logoutBtn.id = 'aiLogoutBtn';
    logoutBtn.title = 'Logout';
    logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    logoutBtn.addEventListener('click', logoutUser);
    headerActions.insertBefore(logoutBtn, headerActions.firstChild);
  }

  // Show welcome message
  messagesArea.innerHTML = `
    <div class="ai-msg ai-msg-bot">
      <div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="ai-msg-bubble">
        <p>🪵 Halo <strong>${user.displayName?.split(' ')[0]}</strong>! Saya <strong>Asisten Kencana AI</strong>, siap membantu Anda!</p>
        <p>Silakan tanyakan seputar produk, harga, atau pemesanan Gebyok Kencana Jati Jepara. 👇</p>
      </div>
    </div>
    <div class="ai-quick-chips" id="aiQuickChips">
      <button class="chip" data-q="Berapa harga pintu gebyok kudus ukuran 3 meter?">💰 Harga Gebyok Kudus 3m</button>
      <button class="chip" data-q="Apa saja model gebyok yang tersedia?">🚪 Model yang Tersedia</button>
      <button class="chip" data-q="Berapa lama waktu pengerjaan gebyok?">⏱️ Lama Pengerjaan</button>
      <button class="chip" data-q="Apakah bisa custom ukuran sesuai keinginan saya?">✏️ Custom Ukuran</button>
      <button class="chip" data-q="Bagaimana sistem pengiriman dan pemasangan?">🚚 Pengiriman & Pasang</button>
      <button class="chip" data-q="Ada garansi berapa tahun?">🛡️ Info Garansi</button>
    </div>
  `;

  // Enable input
  if (inputEl) { inputEl.disabled = false; inputEl.placeholder = 'Ketik pertanyaan Anda di sini...'; }
  if (sendBtn) sendBtn.disabled = false;

  // Re-attach chip listeners
  messagesArea.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.getAttribute('data-q')));
  });

  // Create Firestore chat session
  createChatSession(user);
}

// ==========================================
// CREATE FIRESTORE CHAT SESSION
// ==========================================
async function createChatSession(user) {
  try {
    currentChatRef = doc(collection(db, 'users', user.uid, 'chats'));
    await setDoc(currentChatRef, {
      startedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      page:      window.location.href,
    });
  } catch (err) {
    console.error('Error creating chat session:', err);
  }
}

// ==========================================
// GOOGLE LOGIN
// ==========================================
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will handle the rest
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('Login error:', err);
      alert('Gagal login: ' + err.message);
    }
  }
}

// ==========================================
// LOGOUT
// ==========================================
async function logoutUser() {
  if (confirm('Yakin ingin logout dari Asisten Kencana AI?')) {
    chatHistory = [];
    await signOut(auth);
    // onAuthStateChanged will show login screen
  }
}

// ==========================================
// APPEND MESSAGE
// ==========================================
function appendMessage(role, htmlContent) {
  const chips = messagesArea.querySelector('.ai-quick-chips');
  if (role === 'user' && chips) chips.style.display = 'none';

  const msgEl = document.createElement('div');
  msgEl.className = `ai-msg ai-msg-${role}`;

  if (role === 'bot') {
    msgEl.innerHTML = `
      <div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="ai-msg-bubble">${htmlContent}</div>
    `;
  } else {
    msgEl.innerHTML = `<div class="ai-msg-bubble">${htmlContent}</div>`;
  }

  messagesArea.appendChild(msgEl);
  scrollToBottom();
  return msgEl;
}

// ==========================================
// TYPING INDICATOR
// ==========================================
function showTyping() {
  const el = document.createElement('div');
  el.className = 'ai-msg ai-msg-bot';
  el.id = 'aiTypingIndicator';
  el.innerHTML = `
    <div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ai-typing-bubble">
      <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
    </div>`;
  messagesArea.appendChild(el);
  scrollToBottom();
}
function hideTyping() {
  const el = document.getElementById('aiTypingIndicator');
  if (el) el.remove();
}
function scrollToBottom() {
  if (messagesArea) messagesArea.scrollTop = messagesArea.scrollHeight;
}

// ==========================================
// SIMPLE MARKDOWN PARSER
// ==========================================
function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ==========================================
// CALL GEMINI API
// ==========================================
async function askGemini(userMessage) {
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: chatHistory,
    generationConfig: { temperature: 0.75, maxOutputTokens: 512, topP: 0.95 },
  };

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) throw new Error('Respons kosong');

    chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
    return aiText;

  } catch (err) {
    console.error('Gemini Error:', err);
    if (err.message.includes('API key not valid')) {
      return '⚠️ **API Key Gemini tidak valid.** Silakan periksa konfigurasi di file `ai-chat.js`.';
    }
    return '😔 Maaf, terjadi gangguan. Hubungi kami langsung via WhatsApp **0812-3456-7890**.';
  }
}

// ==========================================
// SAVE MESSAGE TO FIRESTORE
// ==========================================
async function saveMessageToFirestore(userMsg, aiMsg) {
  if (!currentUser || !currentChatRef) return;
  try {
    // Save message pair
    await addDoc(collection(currentChatRef, 'messages'), {
      userMessage: userMsg,
      aiResponse:  aiMsg,
      timestamp:   serverTimestamp(),
    });
    // Update user stats
    await updateDoc(doc(db, 'users', currentUser.uid), {
      totalChats:  increment(1),
      lastSeen:    serverTimestamp(),
    });
  } catch (err) {
    console.error('Error saving message:', err);
  }
}

// ==========================================
// SEND MESSAGE
// ==========================================
async function sendMessage(text) {
  const message = text || (inputEl && inputEl.value.trim());
  if (!message || isTyping || !currentUser) return;

  if (inputEl) { inputEl.value = ''; inputEl.style.height = 'auto'; }

  isTyping = true;
  if (sendBtn) sendBtn.disabled = true;

  appendMessage('user', escapeHtml(message));
  showTyping();

  const aiResponse = await askGemini(message);
  hideTyping();

  if (aiResponse) {
    appendMessage('bot', parseMarkdown(aiResponse));
    // Save to Firestore in background
    saveMessageToFirestore(message, aiResponse);
  }

  isTyping = false;
  if (sendBtn) sendBtn.disabled = false;
  if (inputEl) { inputEl.disabled = false; inputEl.focus(); }
}

// ==========================================
// CLEAR CHAT
// ==========================================
clearBtn && clearBtn.addEventListener('click', () => {
  if (!currentUser) return;
  chatHistory = [];
  showChatInterface(currentUser);
});

// ==========================================
// EVENT LISTENERS
// ==========================================
sendBtn && sendBtn.addEventListener('click', () => sendMessage());

inputEl && inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

inputEl && inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
});
