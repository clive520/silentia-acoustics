/**
 * SILENTIA 旗艦乳白耳機 - 官網核心互動邏輯
 */

document.addEventListener('DOMContentLoaded', () => {
  initMultiAngleViewer();
  initSoundVisualizer();
  initReviewsSystem();
  initCheckoutSystem();
  initFaqAccordion();
  initSmoothScroll();
});

// ==========================================
// 1. 三視圖與工藝細節多角度切換器
// ==========================================
function initMultiAngleViewer() {
  const views = {
    hero: {
      src: 'assets/hero.jpg',
      badge: '經典主視角 (Perspective)',
      title: '3/4 俯仰優雅曲線',
      desc: '極致簡約的晨曦乳白霧面外殼，搭配經典圓形耳罩與人體工學夾力設計，在任何角度都流露精緻質感。',
      hotspots: [
        { x: '35%', y: '18%', title: '航太鋁合金頭梁', desc: '經微米級噴砂陽極氧化處理，提供極佳韌性與輕量化結構。' },
        { x: '34%', y: '68%', title: '專屬聲學腔體', desc: '內建 40mm 鍍鈹振膜，0.05% 超低失真呈現母帶級純淨音質。' },
        { x: '68%', y: '72%', title: '記憶海綿耳墊', desc: '慢回彈人體工學乳白蛋白質皮革，全天配戴無悶熱壓迫感。' }
      ]
    },
    front: {
      src: 'assets/view-front.jpg',
      badge: '對稱正視圖 (Front View)',
      title: '極致平衡的對稱美學',
      desc: '無縫一體式頭帶流線，均勻分散頭部頂點重力，搭配貼合兩耳的微角度傾角設計，達到物理級自然被動隔音。',
      hotspots: [
        { x: '50%', y: '12%', title: '一體化承重橫樑', desc: '精密計算頭部弧度，重量僅 260g，實現仿若無物的佩戴感。' },
        { x: '28%', y: '65%', title: '右聲道發聲單元', desc: '獨立調音腔室，呈現清晰通透的中高頻與醇厚低音。' },
        { x: '72%', y: '65%', title: '左聲道發聲單元', desc: '雙晶片高精度時序同步，營造極具臨場感的 3D 空間音場。' }
      ]
    },
    side: {
      src: 'assets/view-detail.jpg',
      badge: '90° 俐落側視圖 (Side Profile)',
      title: '標誌性同心圓與精密樞紐',
      desc: '呈現純粹乳白色調與側邊細緻金屬飾圈。微型按鍵隱藏於幾何線條中，兼具盲操直覺與極簡純白外觀。',
      hotspots: [
        { x: '50%', y: '32%', title: '精密伸縮滑軌', desc: '多段卡榫調節阻尼，經 10,000 次拉伸耐久度嚴格測試。' },
        { x: '50%', y: '73%', title: '觸控感應中樞', desc: '單指輕按播放暫停，滑動微調音量，長按切換降噪模式。' },
        { x: '50%', y: '88%', title: '雙向降噪麥克風', desc: '波束成形技術精準捕捉人聲，強效消除周圍風噪。' }
      ]
    },
    dynamic: {
      src: 'assets/view-side.jpg',
      badge: '45° 工藝特寫視圖 (Detail Angle)',
      title: '光影流轉的細節工藝',
      desc: '耳罩與頭梁銜接處採用高精密摺疊鉸鏈，不僅便於單手摺疊收納，更展現極致純白材質與光影層次的和諧交融。',
      hotspots: [
        { x: '32%', y: '35%', title: '旋轉摺疊結構', desc: '向內旋平收納，輕鬆置入隨附的磁吸保護盒。' },
        { x: '35%', y: '70%', title: '全白同色系調配', desc: '耳罩外殼、皮革、頭帶色彩 100% 精準一致，展現溫潤乳白光澤。' }
      ]
    }
  };

  const imgEl = document.getElementById('viewer-image');
  const badgeEl = document.getElementById('viewer-badge');
  const titleEl = document.getElementById('viewer-title');
  const descEl = document.getElementById('viewer-desc');
  const hotspotsContainer = document.getElementById('viewer-hotspots');
  const buttons = document.querySelectorAll('[data-view-target]');

  if (!imgEl) return;

  function setView(viewKey) {
    const data = views[viewKey];
    if (!data) return;

    imgEl.style.opacity = '0';
    imgEl.style.transform = 'scale(0.96)';

    setTimeout(() => {
      imgEl.src = data.src;
      badgeEl.textContent = data.badge;
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;

      renderHotspots(data.hotspots);

      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1)';
    }, 200);

    buttons.forEach((btn) => {
      const isCurrent = btn.getAttribute('data-view-target') === viewKey;
      if (isCurrent) {
        btn.classList.add('bg-neutral-900', 'text-white', 'shadow-md');
        btn.classList.remove('bg-neutral-100', 'text-neutral-700', 'hover:bg-neutral-200');
      } else {
        btn.classList.remove('bg-neutral-900', 'text-white', 'shadow-md');
        btn.classList.add('bg-neutral-100', 'text-neutral-700', 'hover:bg-neutral-200');
      }
    });
  }

  function renderHotspots(hotspots) {
    hotspotsContainer.innerHTML = '';
    hotspots.forEach((spot) => {
      const pin = document.createElement('div');
      pin.className = 'absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20';
      pin.style.left = spot.x;
      pin.style.top = spot.y;

      pin.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-amber-400/40"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-white shadow-md border-2 border-amber-600 text-[10px] font-bold text-neutral-800 transition-transform group-hover:scale-125">
            +
          </span>
        </div>
        <div class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-neutral-900/90 text-white backdrop-blur-md rounded-xl text-xs shadow-xl opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 text-center">
          <div class="font-semibold text-amber-200 mb-0.5">${spot.title}</div>
          <div class="text-neutral-300 leading-snug">${spot.desc}</div>
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90"></div>
        </div>
      `;
      hotspotsContainer.appendChild(pin);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-view-target');
      setView(target);
    });
  });

  setView('hero');
}

// ==========================================
// 2. 聲學互動模擬：ANC 主動降噪 vs 環境通透
// ==========================================
function initSoundVisualizer() {
  const canvas = document.getElementById('soundwave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let mode = 'anc';
  let animationId;
  let phase = 0;

  const btnAnc = document.getElementById('btn-mode-anc');
  const btnTrans = document.getElementById('btn-mode-trans');
  const statusLabel = document.getElementById('sound-status-label');
  const dbMeter = document.getElementById('sound-db-meter');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 140;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2;
    phase += 0.05;

    ctx.lineWidth = 2.5;

    if (mode === 'anc') {
      ctx.beginPath();
      ctx.strokeStyle = '#0071e3';
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin(x * 0.02 + phase) * 2.5 * Math.sin(x * 0.005);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.2)';
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.cos(x * 0.03 - phase) * 1.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.strokeStyle = '#d97706';
      for (let x = 0; x < canvas.width; x++) {
        const y =
          midY +
          Math.sin(x * 0.03 + phase) * 20 * Math.sin(x * 0.01) +
          Math.cos(x * 0.08 - phase * 1.5) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
      for (let x = 0; x < canvas.width; x++) {
        const y =
          midY +
          Math.sin(x * 0.05 - phase) * 12 +
          Math.cos(x * 0.02 + phase * 2) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    animationId = requestAnimationFrame(drawWave);
  }

  function setMode(newMode) {
    mode = newMode;
    if (mode === 'anc') {
      btnAnc.classList.add('bg-neutral-900', 'text-white', 'shadow-md');
      btnAnc.classList.remove('bg-white', 'text-neutral-700');
      btnTrans.classList.remove('bg-neutral-900', 'text-white', 'shadow-md');
      btnTrans.classList.add('bg-white', 'text-neutral-700');

      statusLabel.textContent = '智慧反向聲波已啟動・消除 98.6% 背景低頻雜音';
      statusLabel.className = 'text-sm font-medium text-blue-600 transition-colors';
      dbMeter.textContent = '-40 dB';
      dbMeter.className = 'text-3xl font-bold tracking-tight text-blue-600';
    } else {
      btnTrans.classList.add('bg-neutral-900', 'text-white', 'shadow-md');
      btnTrans.classList.remove('bg-white', 'text-neutral-700');
      btnAnc.classList.remove('bg-neutral-900', 'text-white', 'shadow-md');
      btnAnc.classList.add('bg-white', 'text-neutral-700');

      statusLabel.textContent = '環境麥克風即時收音・對話與周遭環境聲清晰入耳';
      statusLabel.className = 'text-sm font-medium text-amber-600 transition-colors';
      dbMeter.textContent = '0 dB 零延遲';
      dbMeter.className = 'text-3xl font-bold tracking-tight text-amber-600';
    }
  }

  if (btnAnc && btnTrans) {
    btnAnc.addEventListener('click', () => setMode('anc'));
    btnTrans.addEventListener('click', () => setMode('transparency'));
  }

  drawWave();
}

// ==========================================
// 3. 使用者回饋與真實評論系統
// ==========================================
function initReviewsSystem() {
  const reviewsData = [
    {
      id: 1,
      name: '林書瑋 (Kevin L.)',
      role: '獨立音樂製作人',
      edition: 'Silentia Pro 旗艦版 (晨曦乳白)',
      rating: 5,
      date: '2026/10/12',
      tag: '音質',
      comment:
        '鍍鈹單體的細節動態完全超越預期！中高頻弦樂的泛音非常通透，完全沒有過度渲染的厚重感。重點是全機身溫潤的乳白色實體比照片還要更有高級感，戴在頭上非常吸睛！',
      likes: 68
    },
    {
      id: 2,
      name: '張庭瑀 (Clara C.)',
      role: '跨國軟體工程師',
      edition: 'Silentia 普通版 (晨曦乳白)',
      rating: 5,
      date: '2026/10/08',
      tag: '舒適度',
      comment:
        '每天遠距上班連續戴 8 小時也不夾耳，耳罩記憶海綿很軟很透氣。普通版 NT$3,990 這個價位能買到這種做工和降噪水準，CP值真的封頂了。',
      likes: 42
    },
    {
      id: 3,
      name: '黃柏翰 (Alex H.)',
      role: '都會商務通勤族',
      edition: 'Silentia Pro 旗艦版 (晨曦乳白)',
      rating: 5,
      date: '2026/09/29',
      tag: '降噪',
      comment:
        '每天搭文湖線通勤捷運，戴上瞬間像按了消音鍵一樣世界徹底安靜下來！空間音訊看電影環繞感強烈，非常值得直上 5,990 高階款。',
      likes: 55
    },
    {
      id: 4,
      name: '陳曼妮 (Mandy C.)',
      role: '建築外觀設計師',
      edition: 'Silentia Pro 旗艦版 (晨曦乳白)',
      rating: 5,
      date: '2026/09/25',
      tag: '外觀',
      comment:
        '非常慶幸這款堅持做純粹的乳白色！沒有市面上滿街跑的黑色塑料廉價感，沙色調的奶白跟大地色系穿搭非常搭，設計細節十分到位。',
      likes: 39
    },
    {
      id: 5,
      name: '沈彥勳 (Sean S.)',
      role: '播客音訊剪輯師',
      edition: 'Silentia 普通版 (晨曦乳白)',
      rating: 4,
      date: '2026/09/18',
      tag: '音質',
      comment:
        '通話降噪麥克風在咖啡廳開會時對面完全聽不到背景人聲，人聲還原很自然。續航力很強，用一整週都還不需要充電。',
      likes: 27
    },
    {
      id: 6,
      name: '郭安琪 (Angela K.)',
      role: '台大研究所研究生',
      edition: 'Silentia Pro 旗艦版 (晨曦乳白)',
      rating: 5,
      date: '2026/09/10',
      tag: '降噪',
      comment:
        '在圖書館和咖啡廳讀書的必備神器。重量輕、外殼手感絲滑溫潤，包裝裡的磁吸硬殼收納盒也很有質感。',
      likes: 31
    }
  ];

  const listContainer = document.getElementById('reviews-list');
  const filterButtons = document.querySelectorAll('[data-review-filter]');
  const openModalBtn = document.getElementById('btn-open-review-modal');
  const reviewModal = document.getElementById('review-modal');
  const closeModalBtn = document.getElementById('btn-close-review-modal');
  const reviewForm = document.getElementById('review-form');

  if (!listContainer) return;

  function renderReviews(filter = '全部') {
    const filtered =
      filter === '全部'
        ? reviewsData
        : reviewsData.filter((r) => r.tag === filter);

    listContainer.innerHTML = '';

    filtered.forEach((review) => {
      const card = document.createElement('div');
      card.className =
        'bg-white rounded-3xl p-7 shadow-sm border border-neutral-150/70 hover:shadow-md transition-shadow flex flex-col justify-between';

      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-neutral-900">${review.name}</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <svg class="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  已驗證購買
                </span>
              </div>
              <div class="text-xs text-neutral-400 mt-0.5">${review.role} · ${review.date}</div>
            </div>
            <div class="text-amber-400 tracking-wider text-sm font-bold">${stars}</div>
          </div>
          <div class="inline-block text-xs font-medium text-neutral-500 bg-neutral-100 rounded-lg px-2.5 py-1 mb-3">
            已選購：${review.edition}
          </div>
          <p class="text-sm text-neutral-700 leading-relaxed">${review.comment}</p>
        </div>
        <div class="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <span>心得分類：<strong class="text-neutral-600">${review.tag}體驗</strong></span>
          <button type="button" class="like-btn flex items-center space-x-1 hover:text-neutral-900 transition-colors" data-id="${review.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
            <span class="like-count font-medium">${review.likes}</span>
          </button>
        </div>
      `;
      listContainer.appendChild(card);
    });

    listContainer.querySelectorAll('.like-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const countSpan = btn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent, 10);
        if (!btn.classList.contains('liked')) {
          countSpan.textContent = count + 1;
          btn.classList.add('liked', 'text-blue-600');
        } else {
          countSpan.textContent = count - 1;
          btn.classList.remove('liked', 'text-blue-600');
        }
      });
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('bg-neutral-900', 'text-white');
        b.classList.add('bg-white', 'text-neutral-600');
      });
      btn.classList.add('bg-neutral-900', 'text-white');
      btn.classList.remove('bg-white', 'text-neutral-600');
      renderReviews(btn.getAttribute('data-review-filter'));
    });
  });

  if (openModalBtn && reviewModal && closeModalBtn) {
    openModalBtn.addEventListener('click', () => {
      reviewModal.classList.remove('hidden');
    });
    closeModalBtn.addEventListener('click', () => {
      reviewModal.classList.add('hidden');
    });
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) reviewModal.classList.add('hidden');
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-review-name').value.trim() || '匿名的聲學愛好者';
      const role = document.getElementById('new-review-role').value.trim() || 'Silentia 忠實聽眾';
      const edition = document.getElementById('new-review-edition').value;
      const tag = document.getElementById('new-review-tag').value;
      const comment = document.getElementById('new-review-text').value.trim();

      if (!comment) return alert('請填寫評價內容！');

      const newReview = {
        id: Date.now(),
        name,
        role,
        edition,
        rating: 5,
        date: '剛剛',
        tag,
        comment,
        likes: 1
      };

      reviewsData.unshift(newReview);
      renderReviews('全部');

      reviewForm.reset();
      reviewModal.classList.add('hidden');
      alert('感謝您的回饋！您的真實評價已發佈。');
    });
  }

  renderReviews('全部');
}

// ==========================================
// 4. 信用卡線上訂購與綠界金流處理系統
// ==========================================
function initCheckoutSystem() {
  const drawer = document.getElementById('checkout-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const closeDrawerBtn = document.getElementById('btn-close-drawer');
  const checkoutTriggers = document.querySelectorAll('[data-open-checkout]');

  let currentEdition = 'pro';
  const editions = {
    standard: {
      name: 'Silentia 普通版',
      price: 3990,
      desc: '40mm 純音單元 · 混合主動降噪 · 30hr 續航'
    },
    pro: {
      name: 'Silentia Pro 旗艦高階版',
      price: 5990,
      desc: '40mm 航太鍍鈹單元 · 自適應動態降噪 · 45hr 續航 · 空間音訊'
    }
  };

  const editionBtns = document.querySelectorAll('[data-select-edition]');
  const summaryName = document.getElementById('summary-product-name');
  const summaryDesc = document.getElementById('summary-product-desc');
  const summaryPrice = document.getElementById('summary-price');
  const summaryTotal = document.getElementById('summary-total-price');
  const submitBtn = document.getElementById('btn-submit-order');
  const submitBtnText = document.getElementById('submit-btn-text');

  function openDrawer(edition = 'pro') {
    setEdition(edition);
    drawer.classList.remove('translate-x-full');
    drawerBackdrop.classList.remove('pointer-events-none', 'opacity-0');
    drawerBackdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.add('translate-x-full');
    drawerBackdrop.classList.remove('opacity-100');
    drawerBackdrop.classList.add('pointer-events-none', 'opacity-0');
    document.body.style.overflow = '';
  }

  function setEdition(edKey) {
    currentEdition = edKey;
    const data = editions[edKey];
    if (!data) return;

    if (summaryName) summaryName.textContent = data.name;
    if (summaryDesc) summaryDesc.textContent = data.desc;
    if (summaryPrice) summaryPrice.textContent = `NT$ ${data.price.toLocaleString()}`;
    if (summaryTotal) summaryTotal.textContent = `NT$ ${data.price.toLocaleString()}`;
    if (submitBtnText) submitBtnText.textContent = `安全信用卡結帳 · NT$ ${data.price.toLocaleString()}`;

    editionBtns.forEach((btn) => {
      const match = btn.getAttribute('data-select-edition') === edKey;
      if (match) {
        btn.classList.add('border-neutral-900', 'bg-neutral-50', 'ring-1', 'ring-neutral-900');
        btn.classList.remove('border-neutral-200');
      } else {
        btn.classList.remove('border-neutral-900', 'bg-neutral-50', 'ring-1', 'ring-neutral-900');
        btn.classList.add('border-neutral-200');
      }
    });
  }

  checkoutTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const ed = btn.getAttribute('data-open-checkout') || 'pro';
      openDrawer(ed);
    });
  });

  editionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const ed = btn.getAttribute('data-select-edition');
      setEdition(ed);
    });
  });

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  const cardInput = document.getElementById('card-number');
  const expInput = document.getElementById('card-expiry');
  const cvvInput = document.getElementById('card-cvv');
  const cardBrandIcon = document.getElementById('card-brand-icon');

  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      const parts = [];
      for (let i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4));
      }
      e.target.value = parts.join(' ');

      if (cardBrandIcon) {
        if (/^4/.test(val)) {
          cardBrandIcon.textContent = 'VISA';
          cardBrandIcon.className = 'text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded';
        } else if (/^5[1-5]/.test(val)) {
          cardBrandIcon.textContent = 'MC';
          cardBrandIcon.className = 'text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded';
        } else if (/^35/.test(val)) {
          cardBrandIcon.textContent = 'JCB';
          cardBrandIcon.className = 'text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded';
        } else {
          cardBrandIcon.textContent = 'CARD';
          cardBrandIcon.className = 'text-xs font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded';
        }
      }
    });
  }

  if (expInput) {
    expInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }

  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }

  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSuccessModal = document.getElementById('checkout-success-modal');
  const closeSuccessModalBtn = document.getElementById('btn-close-success-modal');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const customerName = document.getElementById('cust-name').value.trim();
      const customerPhone = document.getElementById('cust-phone').value.trim();
      const shippingAddress = document.getElementById('cust-address').value.trim();
      const cardNumber = cardInput ? cardInput.value.replace(/\s/g, '') : '';

      if (!customerName || !customerPhone || !shippingAddress) {
        return alert('請填寫完整收件姓名、電話與地址！');
      }

      if (cardNumber.length < 15) {
        return alert('請輸入有效的 16 位信用卡號！');
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        通訊加密中，連接綠界金流...
      `;

      try {
        const orderData = {
          productName: editions[currentEdition].name,
          amount: editions[currentEdition].price,
          customerName,
          customerPhone,
          shippingAddress,
          cardNumber
        };

        const result = await window.ECPayService.processCheckout(orderData);

        if (result && result.success) {
          document.getElementById('receipt-trade-no').textContent = result.tradeNo;
          document.getElementById('receipt-date').textContent = result.tradeDate;
          document.getElementById('receipt-product').textContent = `${result.itemName} (晨曦乳白)`;
          document.getElementById('receipt-amount').textContent = `NT$ ${parseInt(result.amount).toLocaleString()}`;
          document.getElementById('receipt-last4').textContent = result.cardLast4;
          document.getElementById('receipt-address').textContent = result.shippingAddress;
          document.getElementById('receipt-auth-code').textContent = result.authCode;

          closeDrawer();
          checkoutSuccessModal.classList.remove('hidden');
        }
      } catch (err) {
        console.error(err);
        alert('結帳連線失敗，請稍後再試。');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        setEdition(currentEdition);
      }
    });
  }

  if (closeSuccessModalBtn && checkoutSuccessModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      checkoutSuccessModal.classList.add('hidden');
    });
  }
}

// ==========================================
// 5. 常見問題摺疊收合 (Accordion)
// ==========================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        document.querySelectorAll('.faq-content').forEach((c) => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach((i) => i.classList.remove('rotate-180'));

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });
}

// ==========================================
// 6. 平滑捲動錨點
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 60;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
