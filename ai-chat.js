/**
 * ASISTEN KENCANA AI — Powered by Google Gemini
 * AI Chatbot for Gebyok Kencana Jati Jepara - Mitra Utama Group
 *
 * ⚠️  KONFIGURASI: Ganti nilai GEMINI_API_KEY di bawah ini dengan API key Anda.
 *     Dapatkan API Key GRATIS di: https://aistudio.google.com/app/apikey
 */

const GEMINI_API_KEY = 'MASUKKAN_API_KEY_ANDA_DISINI'; // <-- GANTI DI SINI
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
   - Deskripsi: Ukiran relief tembus 3D khas Kudus dengan ornamen Gunungan Wayang dan lung-lungan. Sangat anggun untuk pintu depan rumah Joglo, limasan, maupun hunian modern tropis.
   - Dimensi Standar: Lebar 300 cm, Tinggi 275 cm (custom bisa s/d 600 cm)
   - Ukuran Tiang (Soko): 14 cm x 12 cm
   - Harga Normal: Rp 26.500.000
   - Harga Promo: Rp 19.800.000
   - Bonus: Handle pintu kuningan antik ukir + palet kayu ekspor

2. GEBYOK PELAMINAN MEGAH UKIR BUNGA & RELIEF KARAWANGAN
   - Tipe: Dekorasi Pelaminan & Wedding Stage / Backdrop Pernikahan
   - Deskripsi: Backdrop dekorasi panggung pernikahan adat Jawa & Nusantara. Desain modular sistem knockdown mudah dibongkar-pasang.
   - Dimensi: Lebar 600-800 cm (6 panel knockdown), Tinggi 280 cm
   - Harga Normal: Rp 42.000.000
   - Harga Promo: Rp 32.500.000
   - Cocok untuk: Wedding Organizer, Gedung Pertemuan, Hotel, Pendopo

3. PARTISI SKETSEL GEBYOK PENYEKAT RUANG MODERN
   - Tipe: Partisi Interior / Pembatas Ruang
   - Deskripsi: Penyekat ruang tamu dan ruang keluarga yang elegan. Pola kisi-kisi ukiran tembus (karawangan) memberikan sirkulasi udara dan cahaya natural.
   - Dimensi: Lebar 200-250 cm, Tinggi 240 cm
   - Model: Bisa lipat / geser / statis
   - Ukiran: Dua muka berukir tembus (bisa dilihat dari depan & belakang)
   - Harga Normal: Rp 17.500.000
   - Harga Promo: Rp 13.900.000

4. GEBYOK ROYAL JEPARA KALIGRAFI & RELIEF LUNG FLORAL
   - Tipe: Pintu Utama Luxury / Fasad Villa & Resort
   - Deskripsi: Kemegahan kayu jati grade A super dengan finishing melamic dark brown. Ornamen kaligrafi, relief naga & gunungan kembar yang berkarisma.
   - Dimensi: Lebar 350 cm, Tinggi 280 cm
   - Tiang: 15 cm x 14 cm extra tebal
   - Harga Normal: Rp 31.000.000
   - Harga Promo: Rp 23.500.000

5. PRODUK LAINNYA (Custom Order):
   - Gebyok Pintu Gapura Masjid (dengan ornamen kaligrafi Arab)
   - Jendela Gebyok Ukir
   - Backdrop Acara & Pameran
   - Gebyok Minimalis Modern (kombinasi kayu & kaca)

=== BAHAN & KUALITAS ===
- Kayu Jati Grade A Super: Jati TPK Perhutani tua (>40 tahun), kering oven (MC < 12%), serat padat emas
- Kayu Jati Grade B: Jati kampung merah pilihan, kering alami, harga lebih ekonomis
- Semua kayu bersertifikat SVLK (legalitas kayu resmi pemerintah)
- Teknik sambungan: Purus & Pantek tradisional (tanpa paku logam kasar)
- Bebas rayap, bebas bubuk, tahan cuaca

=== ESTIMASI HARGA SISTEM KALKULASI ===
Perhitungan kasar berdasarkan kalkulator website:
- Harga Dasar per meter lebar: 
  * Pintu Kudusan: Rp 6.200.000/m
  * Gebyok Minimalis: Rp 5.300.000/m
  * Pelaminan: Rp 4.200.000/m
  * Partisi: Rp 4.800.000/m
- Multiplier Kualitas Kayu:
  * Jati TPK Super (Grade A): x 1.25
  * Jati Kampung Pilihan (Grade B): x 1.0
- Biaya Tambahan Finishing:
  * Natural Doff/Satin: Gratis
  * Melamic Gloss Mewah: +Rp 400.000
  * Aksen Prada Emas (Gold Leaf): +Rp 1.200.000
  * Rustic Antik Tua: +Rp 600.000

=== PILIHAN FINISHING ===
1. Natural Doff/Satin – menampilkan keindahan serat asli kayu jati
2. Melamic Gloss/Semigloss – kilap premium, proteksi tinggi
3. Aksen Prada Emas (Gold Leaf) – sapuan cat emas mewah di ornamen relief
4. Rustic/Antik Bakar – kesan kayu antik berusia ratusan tahun

=== WAKTU PENGERJAAN ===
- Stok mentahan (siap finishing): 7-14 hari
- Custom ukuran standar: 14-21 hari kerja
- Custom ukuran lebar >5m atau kerumitan tinggi: 25-45 hari kerja

=== PENGIRIMAN & PEMASANGAN ===
- Area Jawa & Bali: Dikirim dengan armada truk ekspedisi khusus mebel + tim tukang pasang (GRATIS PASANG)
- Luar Pulau (Sumatera, Kalimantan, Sulawesi, Papua, NTT, Maluku): Packing palet kayu solid + asuransi kargo
- Bisa cod di workshop Jepara
- Ada foto & video update pengerjaan setiap 3 hari sekali

=== GARANSI ===
- Garansi resmi 10 tahun untuk kekuatan struktur kayu & anti rayap (khusus Jati TPK Grade A)
- Garansi penggantian bagian jika ada cacat produksi
- Tim purna jual siap membantu

=== SISTEM PEMBAYARAN ===
- DP awal: 30-40% saat tanda jadi & penerbitan SPK (Surat Perintah Kerja)
- Progres tahap finishing: 30%
- Pelunasan: saat barang selesai QC & siap kirim
- Metode: Transfer bank, QRIS, tunai di workshop

=== CARA PEMESANAN ===
1. Hubungi via WhatsApp 0812-3456-7890 atau email mitrautama.info@gmail.com
2. Diskusikan model, ukuran, bahan, dan finishing
3. Tim desain membuat sketsa kerja / gambar 3D
4. Setujui desain → tanda jadi DP
5. Pengerjaan dimulai dengan update berkala via foto/video
6. Pengiriman dan pemasangan

=== PANDUAN MENJAWAB ===
- Jawab dalam Bahasa Indonesia yang ramah, hangat, dan profesional
- Gunakan emoji yang relevan untuk membuat percakapan lebih hidup (🪵 🚪 💰 ✅ 🚚 📞 dll)
- Untuk pertanyaan harga, berikan estimasi range dengan catatan bahwa harga final tergantung detail custom
- Selalu akhiri jawaban tentang harga/pemesanan dengan ajakan untuk menghubungi WhatsApp: 0812-3456-7890
- Jika pertanyaan di luar topik Gebyok Kencana / Mitra Utama Group, arahkan kembali ke topik produk kami
- Format jawaban dengan rapi menggunakan list jika diperlukan
- Jawaban tidak boleh terlalu panjang (maksimal 200 kata per respons)
`;

// ==========================================
// CHAT STATE & HISTORY
// ==========================================
let chatHistory = [];
let isTyping = false;

// ==========================================
// DOM ELEMENTS
// ==========================================
const wrapper     = document.getElementById('aiChatWrapper');
const toggleBtn   = document.getElementById('aiChatToggle');
const panel       = document.getElementById('aiChatPanel');
const messagesArea = document.getElementById('aiMessagesArea');
const inputEl     = document.getElementById('aiInput');
const sendBtn     = document.getElementById('aiSendBtn');
const clearBtn    = document.getElementById('aiClearBtn');
const closeBtn    = document.getElementById('aiClosePanelBtn');
const quickChips  = document.getElementById('aiQuickChips');

// ==========================================
// HELPER: Check if API key is configured
// ==========================================
function isApiKeyConfigured() {
  return GEMINI_API_KEY && GEMINI_API_KEY !== 'MASUKKAN_API_KEY_ANDA_DISINI' && GEMINI_API_KEY.length > 10;
}

// ==========================================
// OPEN / CLOSE PANEL
// ==========================================
function openPanel() {
  wrapper.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  inputEl && inputEl.focus();

  // Show API key warning if not configured
  if (!isApiKeyConfigured()) {
    showApiKeyWarning();
  }
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
// SHOW API KEY WARNING
// ==========================================
function showApiKeyWarning() {
  if (document.getElementById('aiApiKeyWarn')) return;

  const warn = document.createElement('div');
  warn.className = 'ai-apikey-warn';
  warn.id = 'aiApiKeyWarn';
  warn.innerHTML = `
    <strong>⚠️ API Key Belum Dikonfigurasi</strong>
    <span>Untuk mengaktifkan AI, masukkan Gemini API Key di file <code>ai-chat.js</code> baris pertama.</span>
    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">🔑 Dapatkan API Key GRATIS di Google AI Studio →</a>
  `;

  const firstMsg = messagesArea.querySelector('.ai-msg');
  if (firstMsg && firstMsg.nextSibling) {
    messagesArea.insertBefore(warn, firstMsg.nextSibling);
  } else {
    messagesArea.appendChild(warn);
  }

  // Disable input
  if (inputEl) inputEl.disabled = true;
  if (sendBtn) sendBtn.disabled = true;
  if (inputEl) inputEl.placeholder = 'API Key belum dikonfigurasi...';
}

// ==========================================
// APPEND MESSAGE TO CHAT
// ==========================================
function appendMessage(role, htmlContent) {
  const msgEl = document.createElement('div');
  msgEl.className = `ai-msg ai-msg-${role}`;

  if (role === 'bot') {
    msgEl.innerHTML = `
      <div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="ai-msg-bubble">${htmlContent}</div>
    `;
  } else {
    msgEl.innerHTML = `
      <div class="ai-msg-bubble">${htmlContent}</div>
    `;
  }

  // Hide chips after first user message
  if (role === 'user' && quickChips) {
    quickChips.style.display = 'none';
  }

  messagesArea.appendChild(msgEl);
  scrollToBottom();
  return msgEl;
}

// ==========================================
// TYPING INDICATOR
// ==========================================
function showTyping() {
  const typingEl = document.createElement('div');
  typingEl.className = 'ai-msg ai-msg-bot';
  typingEl.id = 'aiTypingIndicator';
  typingEl.innerHTML = `
    <div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ai-typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  messagesArea.appendChild(typingEl);
  scrollToBottom();
}

function hideTyping() {
  const typingEl = document.getElementById('aiTypingIndicator');
  if (typingEl) typingEl.remove();
}

function scrollToBottom() {
  if (messagesArea) {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
}

// ==========================================
// SIMPLE MARKDOWN PARSER (Bold, List, Line Breaks)
// ==========================================
function parseMarkdown(text) {
  return text
    // Bold **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Bullet list: lines starting with - or *
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*?<\/li>(\s*<li>.*?<\/li>)*)/gs, '<ul>$1</ul>')
    // Double line breaks to paragraph breaks
    .replace(/\n{2,}/g, '</p><p>')
    // Single line breaks
    .replace(/\n/g, '<br>')
    // Wrap in paragraph
    .replace(/^(?!<ul>|<p>)(.+)/, '<p>$1')
    .replace(/(.+)(?<!>)$/, '$1</p>');
}

// ==========================================
// CALL GEMINI API
// ==========================================
async function askGemini(userMessage) {
  if (!isApiKeyConfigured()) return;

  // Add to history
  chatHistory.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: chatHistory,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 512,
      topP: 0.95,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ]
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) throw new Error('Respons kosong dari AI');

    // Add AI response to history
    chatHistory.push({
      role: 'model',
      parts: [{ text: aiText }]
    });

    return aiText;

  } catch (err) {
    console.error('Gemini API Error:', err);

    // Handle specific errors
    if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid')) {
      return '⚠️ **API Key tidak valid.** Pastikan Anda sudah memasukkan API Key yang benar dari [Google AI Studio](https://aistudio.google.com/app/apikey).';
    }

    if (err.message.includes('QUOTA_EXCEEDED') || err.message.includes('429')) {
      return '⚠️ Kuota API sementara habis. Silakan coba beberapa saat lagi atau hubungi kami langsung via WhatsApp **0812-3456-7890**.';
    }

    return '😔 Maaf, terjadi gangguan koneksi. Silakan coba lagi atau hubungi kami langsung via WhatsApp **0812-3456-7890** untuk mendapatkan informasi lengkap.';
  }
}

// ==========================================
// SEND MESSAGE
// ==========================================
async function sendMessage(text) {
  const message = (text || (inputEl && inputEl.value.trim()));
  if (!message || isTyping) return;

  if (!isApiKeyConfigured()) {
    showApiKeyWarning();
    return;
  }

  // Clear input
  if (inputEl) {
    inputEl.value = '';
    inputEl.style.height = 'auto';
  }

  isTyping = true;
  if (sendBtn) sendBtn.disabled = true;

  // Show user message
  appendMessage('user', escapeHtml(message));

  // Show typing
  showTyping();

  // Call Gemini
  const aiResponse = await askGemini(message);

  // Remove typing, show AI reply
  hideTyping();

  if (aiResponse) {
    appendMessage('bot', parseMarkdown(aiResponse));
  }

  isTyping = false;
  if (sendBtn) sendBtn.disabled = false;
  if (inputEl) {
    inputEl.disabled = false;
    inputEl.focus();
  }
}

// ==========================================
// ESCAPE HTML (prevent XSS in user messages)
// ==========================================
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Send button
sendBtn && sendBtn.addEventListener('click', () => sendMessage());

// Enter key (Shift+Enter for new line)
inputEl && inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize textarea
inputEl && inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
});

// Quick chips click
quickChips && quickChips.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const question = chip.getAttribute('data-q');
    if (question) sendMessage(question);
  });
});

// Clear history
clearBtn && clearBtn.addEventListener('click', () => {
  chatHistory = [];
  // Clear all bot/user messages except welcome
  const messages = messagesArea.querySelectorAll('.ai-msg');
  messages.forEach((msg, i) => {
    if (i > 0) msg.remove();
  });
  // Show chips again
  if (quickChips) quickChips.style.display = 'flex';
  // Remove api key warning if present
  const warn = document.getElementById('aiApiKeyWarn');
  if (warn) warn.remove();
});
