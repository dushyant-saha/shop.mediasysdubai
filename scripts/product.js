document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Product Image Gallery (Thumbnails + Prev/Next Circular Buttons) ---
  const mainImg = document.getElementById('main-product-image');
  const thumbs = Array.from(document.querySelectorAll('.prod-thumb'));
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  let activeImgIdx = 0;

  function setGalleryImage(index) {
    if (!thumbs.length || !mainImg) return;
    activeImgIdx = (index + thumbs.length) % thumbs.length;
    const targetImg = thumbs[activeImgIdx].querySelector('img');

    mainImg.classList.add('fade-out');
    setTimeout(() => {
      mainImg.src = targetImg.src;
      mainImg.classList.remove('fade-out');
    }, 140);

    thumbs.forEach((btn, idx) => {
      if (idx === activeImgIdx) {
        btn.classList.add('active', 'border-gray-900', 'border-2');
        btn.classList.remove('border-gray-200', 'opacity-70');
      } else {
        btn.classList.remove('active', 'border-gray-900', 'border-2');
        btn.classList.add('border-gray-200', 'opacity-70');
      }
    });
  }

  thumbs.forEach((btn, idx) => {
    btn.addEventListener('click', () => setGalleryImage(idx));
  });

  prevBtn?.addEventListener('click', () => setGalleryImage(activeImgIdx - 1));
  nextBtn?.addEventListener('click', () => setGalleryImage(activeImgIdx + 1));

  // --- 2. Subscription Plan Option Pills (Updates Price, Subtitle & SKU) ---
  const planPills = document.querySelectorAll('.plan-pill');
  const planLabel = document.getElementById('selected-plan-label');
  const priceEl = document.getElementById('product-price');
  const oldPriceEl = document.getElementById('product-old-price');
  const subtitleEl = document.getElementById('product-subtitle');
  const skuEl = document.getElementById('product-sku');

  planPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      planPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      if (planLabel) planLabel.textContent = pill.dataset.plan;
      if (priceEl) priceEl.textContent = pill.dataset.price;
      if (oldPriceEl) oldPriceEl.textContent = pill.dataset.old;
      if (subtitleEl) subtitleEl.textContent = pill.dataset.sub;
      if (skuEl) skuEl.textContent = pill.dataset.sku;
    });
  });

  // --- 3. Quantity Stepper ---
  const qtyInput = document.getElementById('prod-qty-input');
  const qtyMinus = document.getElementById('prod-qty-minus');
  const qtyPlus = document.getElementById('prod-qty-plus');

  qtyMinus?.addEventListener('click', () => {
    const val = parseInt(qtyInput.value, 10) || 1;
    if (val > 1) qtyInput.value = val - 1;
  });

  qtyPlus?.addEventListener('click', () => {
    const val = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = val + 1;
  });

  // --- 4. Toast Helper, Add to Cart, Wishlist & Share Button ---
  const toast = document.getElementById('product-toast');
  const navCartCount = document.getElementById('nav-cart-count');
  const navWishlistCount = document.getElementById('nav-wishlist-count');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2400);
  }

  document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
    const qty = parseInt(qtyInput?.value, 10) || 1;
    const currentCart = parseInt(navCartCount?.textContent, 10) || 0;
    if (navCartCount) navCartCount.textContent = currentCart + qty;
    showToast(`Added ${qty} x Maxon One to your cart`);
  });

  document.querySelector('.sidebar-add-cart')?.addEventListener('click', () => {
    const currentCart = parseInt(navCartCount?.textContent, 10) || 0;
    if (navCartCount) navCartCount.textContent = currentCart + 1;
    showToast('Added Cinema 4D to your cart');
  });

  const wishlistBtn = document.getElementById('wishlist-toggle-btn');
  wishlistBtn?.addEventListener('click', () => {
    const isSaved = wishlistBtn.classList.toggle('is-saved');
    const currentWish = parseInt(navWishlistCount?.textContent, 10) || 0;
    if (navWishlistCount) {
      navWishlistCount.textContent = isSaved ? currentWish + 1 : Math.max(0, currentWish - 1);
    }
    showToast(isSaved ? 'Saved to your wishlist' : 'Removed from wishlist');
  });

  document.getElementById('share-product-btn')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard');
  });

  // --- 5. Product Information Tabs (Description, Specification, Vendor, Reviews, Shipping, Q&A) ---
  const tabBtns = document.querySelectorAll('.prod-tab-btn');
  const tabPanels = document.querySelectorAll('.prod-tab-panel');

  function activateTab(targetId) {
    tabBtns.forEach((btn) => {
      const isMatch = btn.dataset.tab === targetId;
      btn.classList.toggle('active', isMatch);
      btn.classList.toggle('text-gray-900', isMatch);
      btn.classList.toggle('border-[#0197d6]', isMatch);
      btn.classList.toggle('text-gray-500', !isMatch);
      btn.classList.toggle('border-transparent', !isMatch);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.id !== targetId);
    });
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  document.getElementById('review-jump-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab('tab-reviews');
    document.getElementById('product-tabs-nav')?.scrollIntoView({ behavior: 'smooth' });
  });
});