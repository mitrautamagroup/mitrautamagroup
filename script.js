/**
 * GEBYOK KENCANA JATI JEPARA - INTERACTIVE SCRIPTS
 * Handling: Live Price Calculator, Product Filtering, QuickView Modal, FAQ Accordion, Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE NAVIGATION TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (mainNav.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close nav when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ==========================================
  // 2. PRODUCT DATA & MODAL QUICKVIEW
  // ==========================================
  const products = {
    1: {
      title: "Pintu Gebyok Kudusan Mahkota Gunungan 3 Dimensi",
      category: "Pintu Utama / Fasad Joglo & Tropis",
      image: "assets/pintu-kudus.jpg",
      oldPrice: "Rp 26.500.000",
      price: "Rp 19.800.000",
      specs: {
        "Dimensi Lebar": "300 cm (Bisa custom s/d 6m)",
        "Tinggi Kusen": "275 cm",
        "Ukuran Soko (Tiang)": "14 cm x 12 cm Solid",
        "Jenis Kayu": "100% Jati TPK Perhutani Tua",
        "Tipe Ukiran": "3 Dimensi Tembus (Karawangan)",
        "Finishing": "Natural Doff / Satin Polyurethane",
        "Sistem Pasak": "Knockdown Purus & Pantek Tradisional",
        "Bonus": "Handle Kuningan Antik Ukir & Palet Kayu"
      },
      description: "Mahakarya ukiran Kudus dengan ornamen khas Gunungan Wayang dan dedaunan lung-lungan yang anggun. Dikerjakan manual oleh empu ukir berpengalaman dengan ketebalan daun pintu mencapai 3.5cm solid jati tanpa sambungan tipis."
    },
    2: {
      title: "Gebyok Pelaminan Megah Ukir Bunga & Relief Karawangan",
      category: "Dekorasi Pelaminan & Wedding Stage",
      image: "assets/pelaminan.jpg",
      oldPrice: "Rp 42.000.000",
      price: "Rp 32.500.000",
      specs: {
        "Dimensi Lebar": "600 - 800 cm (Panel modular)",
        "Tinggi Panggung": "280 cm",
        "Jumlah Panel": "6 Panel Knockdown Bongkar Pasang",
        "Jenis Kayu": "Kayu Jati Solid Pilihan Kering Oven",
        "Sistem Perakitan": "Baut Tanam & Kunci Pasak Cepat",
        "Finishing": "Natural Teak Brown + Aksen Prada Emas",
        "Durabilitas": "Tahan Bongkar Pasang Lebih dari 100x Acara",
        "Bonus": "Palet Box Penyimpanan Khusus Wedding EO"
      },
      description: "Sangat diminati Wedding Organizer & Gedung Pertemuan. Desain megah memancarkan aura keraton Jawa ningrat. Dilengkapi sistem knock-down cerdas yang memungkinkan instalasi hanya dalam tempo 45 menit oleh 2 orang kru."
    },
    3: {
      title: "Partisi Sketsel Gebyok Penyekat Ruang Modern Kontemporer",
      category: "Partisi Interior Ruang Tamu & Villa",
      image: "assets/partisi.jpg",
      oldPrice: "Rp 17.500.000",
      price: "Rp 13.900.000",
      specs: {
        "Dimensi Lebar": "200 - 250 cm",
        "Tinggi Partisi": "240 cm",
        "Tipe Ukiran": "Ukir Tembus 2 Muka (Bisa Dilihat Depan-Belakang)",
        "Jenis Kayu": "Jati Solid Grade A Kering MC 10%",
        "Model": "Bisa Lipat Engsel / Model Berdiri Statis",
        "Finishing": "Natural Teak Oil / Salak Brown Doff",
        "Fungsi": "Penyekat Foyer, Ruang Tamu, Dining Area"
      },
      description: "Solusi estetika untuk membagi ruangan tanpa membuat rumah terasa sempit. Pola ukiran berongga artistik memungkinkan cahaya alami dan semilir sirkulasi udara mengalir dengan leluasa sambil mempertahankan privasi."
    },
    4: {
      title: "Gebyok Royal Jepara Kaligrafi & Relief Lung Floral",
      category: "Pintu Utama Luxury & Fasad Villa",
      image: "assets/hero.jpg",
      oldPrice: "Rp 31.000.000",
      price: "Rp 23.500.000",
      specs: {
        "Dimensi Lebar": "350 cm",
        "Tinggi Kusen": "280 cm",
        "Ukuran Soko": "15 cm x 14 cm Extra Tebal",
        "Jenis Kayu": "Jati TPK Super Gold Perhutani",
        "Detail Ukir": "Kombinasi Relief Naga / Kaligrafi / Flora",
        "Finishing": "Dark Walnut Melamic Gloss Luxury",
        "Kelengkapan": "Kunci Mortise Lock & Grendel Antik Kuningan"
      },
      description: "Pilihan utama bagi hunian bergaya tropis modern dan resort prestisius. Finishing melamic gelap memperlihatkan serat kayu jati alami yang sangat eksotis dengan proteksi anti gores dan anti UV."
    }
  };

  const modal = document.getElementById('productModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openQuickView(id) {
    const item = products[id];
    if (!item || !modal || !modalBody) return;

    let specsHtml = '';
    for (const [key, val] of Object.entries(item.specs)) {
      specsHtml += `<tr><td>${key}</td><td>${val}</td></tr>`;
    }

    const waText = encodeURIComponent(`Halo Gebyok Kencana, saya ingin menanyakan lebih lanjut mengenai ${item.title} seharga ${item.price}. Mohon info ketersediaan stok & estimasi ongkir.`);

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-wrapper">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="modal-details">
          <span class="badge-gold">${item.category}</span>
          <h2 class="modal-title">${item.title}</h2>
          <div class="modal-price-row">
            <span class="price-curr" style="font-size: 1.5rem;">${item.price}</span>
            <span class="price-old" style="font-size: 1rem;">${item.oldPrice}</span>
          </div>
          <p style="font-size: 0.92rem; color: #554437; line-height: 1.6;">${item.description}</p>
          <table class="modal-spec-table">
            <tbody>
              ${specsHtml}
            </tbody>
          </table>
          <div style="margin-top: 12px; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="https://wa.me/6281234567890?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-calc" style="flex: 1; text-align: center;">
              <i class="fa-brands fa-whatsapp"></i> Pesan / Konsultasi Produk Ini
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-quickview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-product');
      openQuickView(pId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });


  // ==========================================
  // 3. PRODUCT FILTER TAB
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || filterValue === 'custom') {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // 4. LIVE PRICE & CUSTOM ESTIMATOR CALCULATOR
  // ==========================================
  const widthSlider = document.getElementById('widthSlider');
  const widthValue = document.getElementById('widthValue');
  const modelBtns = document.querySelectorAll('#calcModelOptions .opt-btn');
  const gradeRadios = document.querySelectorAll('input[name="woodGrade"]');
  const finishBtns = document.querySelectorAll('#calcFinishOptions .finish-btn');

  // Summary elements
  const summaryModelText = document.getElementById('summaryModelText');
  const summaryWidthText = document.getElementById('summaryWidthText');
  const summaryGradeText = document.getElementById('summaryGradeText');
  const summaryFinishText = document.getElementById('summaryFinishText');
  const summaryTimeText = document.getElementById('summaryTimeText');
  const totalEstimatedPrice = document.getElementById('totalEstimatedPrice');
  const btnKirimWaKalkulator = document.getElementById('btnKirimWaKalkulator');

  // State object
  let calcState = {
    modelTitle: "Pintu Kudusan (Mahkota Gunungan)",
    basePricePerMeter: 6200000,
    width: 3.0,
    gradeTitle: "Jati TPK Perhutani Grade A Super",
    gradeMultiplier: 1.25,
    finishTitle: "Natural Jati (Doff)",
    finishExtra: 0
  };

  function formatIDR(amount) {
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }

  function calculateAndRender() {
    // Basic calculation formula: (basePerMeter * width) * gradeMultiplier + finishExtra
    const baseTotal = (calcState.basePricePerMeter * calcState.width) * calcState.gradeMultiplier;
    const finalTotal = baseTotal + calcState.finishExtra;

    if (totalEstimatedPrice) {
      totalEstimatedPrice.textContent = formatIDR(finalTotal);
    }

    if (summaryModelText) summaryModelText.textContent = calcState.modelTitle;
    if (summaryWidthText) summaryWidthText.textContent = `${calcState.width} Meter (Tinggi Menyesuaikan 275cm)`;
    if (summaryGradeText) summaryGradeText.textContent = calcState.gradeTitle;
    if (summaryFinishText) summaryFinishText.textContent = calcState.finishTitle;

    // Time estimate based on width
    if (summaryTimeText) {
      if (calcState.width <= 3.0) {
        summaryTimeText.textContent = "14 - 21 Hari Kerja";
      } else if (calcState.width <= 5.0) {
        summaryTimeText.textContent = "25 - 30 Hari Kerja";
      } else {
        summaryTimeText.textContent = "35 - 45 Hari Kerja";
      }
    }

    // Prefill WhatsApp link
    if (btnKirimWaKalkulator) {
      const waMsg = `Halo Pengrajin Gebyok Kencana,%0A%0ASaya ingin menanyakan pesanan kustom berdasarkan hasil simulasi kalkulator website:%0A- Model: ${encodeURIComponent(calcState.modelTitle)}%0A- Lebar: ${calcState.width} Meter%0A- Kualitas Kayu: ${encodeURIComponent(calcState.gradeTitle)}%0A- Finishing: ${encodeURIComponent(calcState.finishTitle)}%0A- Estimasi Biaya: ${encodeURIComponent(formatIDR(finalTotal))}%0A%0AMohon info ketersediaan bahan, detail sketsa kerja, dan alamat pengiriman saya. Terima kasih!`;
      btnKirimWaKalkulator.href = `https://wa.me/6281234567890?text=${waMsg}`;
    }
  }

  // Model selection handler
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.modelTitle = btn.querySelector('.opt-title').textContent;
      calcState.basePricePerMeter = parseFloat(btn.getAttribute('data-base'));
      calculateAndRender();
    });
  });

  // Width Slider handler
  if (widthSlider) {
    widthSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      calcState.width = val;
      if (widthValue) {
        widthValue.textContent = `${val.toFixed(1)} Meter`;
      }
      calculateAndRender();
    });
  }

  // Wood Grade handler
  gradeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-card').forEach(rc => rc.classList.remove('active'));
      radio.closest('.radio-card').classList.add('active');
      calcState.gradeMultiplier = parseFloat(radio.getAttribute('data-multiplier'));
      calcState.gradeTitle = radio.closest('.radio-card').querySelector('.radio-title').textContent.trim();
      calculateAndRender();
    });
  });

  // Finish handler
  finishBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      finishBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.finishTitle = btn.getAttribute('data-finish');
      calcState.finishExtra = parseFloat(btn.getAttribute('data-extra'));
      calculateAndRender();
    });
  });

  // Run initial calculation
  calculateAndRender();


  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ==========================================
  // 6. STATS NUMBER COUNTER ON SCROLL
  // ==========================================
  let animatedStats = false;
  const statsElements = document.querySelectorAll('.stat-num[data-target]');

  function runStatsAnimation() {
    if (animatedStats || statsElements.length === 0) return;

    statsElements.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      let count = 0;
      const step = Math.ceil(target / 40);

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(timer);
          stat.textContent = target === 2800 ? '2.800+' : target + '+';
        } else {
          stat.textContent = count + '+';
        }
      }, 35);
    });

    animatedStats = true;
  }

  // Trigger when scrolling near stats
  window.addEventListener('scroll', () => {
    const heroStats = document.querySelector('.hero-stats-grid');
    if (heroStats) {
      const rect = heroStats.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.9) {
        runStatsAnimation();
      }
    }
  });


  // ==========================================
  // 7. ACTIVE NAVIGATION ON SCROLL (SCROLLSPY)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

});
