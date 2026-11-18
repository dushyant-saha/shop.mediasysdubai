

    document.querySelectorAll('.product-card').forEach((card) => {
      const carousel = card.querySelector(".product-view");
      const hoverArea = card.querySelector(".hover-area");

      const flkty = new Flickity(carousel, {
        autoPlay: false,
        wrapAround: false,
        prevNextButtons: false,
        pageDots: true,
        contain: true,
        draggable: false // Prevents drag cursor/conflict while hover-scrubbing
      });

      hoverArea.addEventListener("mousemove", function (event) {
        const rect = hoverArea.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = mouseX / width;
        const imageCount = flkty.slides.length;

        let index = Math.floor(percentage * imageCount);
        index = Math.max(0, Math.min(index, imageCount - 1));

        flkty.select(index);
      });

      hoverArea.addEventListener("mouseleave", function () {
        flkty.select(0);
      });
    });

    // --- Quickview Modal Logic ---
    const qvModal = document.getElementById('quickview-modal');
    const qvPanel = document.getElementById('quickview-panel');
    const qvCloseBtn = document.getElementById('quickview-close');
    const qvMainImage = document.getElementById('qv-main-image');
    const qvThumbnails = document.getElementById('qv-thumbnails');
    const qvDots = document.getElementById('qv-dots');
    const qvQtyInput = document.getElementById('qv-qty-input');

    let qvImages = [];
    let qvActiveIndex = 0;

    function renderQvGallery(index) {
      qvActiveIndex = index;
      qvMainImage.style.opacity = '0';
      setTimeout(() => {
        qvMainImage.src = qvImages[index];
        qvMainImage.style.opacity = '1';
      }, 120);

      Array.from(qvThumbnails.children).forEach((thumb, i) => {
        thumb.className = `size-14 rounded-lg border-2 p-1 bg-white cursor-pointer transition ${i === index ? 'border-[#0197d6] shadow-2xs' : 'border-gray-200 opacity-60 hover:opacity-100'
          }`;
      });

      Array.from(qvDots.children).forEach((dot, i) => {
        dot.className = `rounded-full transition-all cursor-pointer ${i === index
          ? 'size-2 bg-transparent ring-2 ring-gray-900'
          : 'size-1.5 bg-gray-900 opacity-70 hover:opacity-100'
          }`;
      });
    }

    function openQuickview(card) {
      // Extract data from clicked card
      const title = card.querySelector('.product-title')?.textContent.trim() || '';
      const price = card.querySelector('.product-price')?.textContent.trim() || '';
      const oldPrice = card.querySelector('.product-old-price')?.textContent.trim() || '';
      const discount = card.querySelector('.product-discount')?.textContent.trim() || '44% OFF';

      document.getElementById('qv-title').textContent = title;
      document.getElementById('qv-price').textContent = price;
      document.getElementById('qv-old-price').textContent = oldPrice;
      document.getElementById('qv-discount').textContent = discount;

      document.getElementById('qv-brand').textContent = card.dataset.brand || 'AJA';
      document.getElementById('qv-sku').textContent = card.dataset.sku || 'GEN10-R0';
      document.getElementById('qv-category').textContent = card.dataset.category || 'Digital Recorders';
      document.getElementById('qv-tags').textContent = card.dataset.tags || title;
      document.getElementById('qv-desc').textContent =
        card.dataset.desc || 'HD/SD Sync Generator, Simultaneous Blackburst & Tri-level, Outputs Assignable';

      // Collect images from card
      qvImages = Array.from(card.querySelectorAll('.product-view-cell img')).map((img) => img.src);
      qvThumbnails.innerHTML = '';
      qvDots.innerHTML = '';

      qvImages.forEach((src, idx) => {
        // Build Thumbnail
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.innerHTML = `<img src="${src}" class="w-full h-full object-contain" alt="Thumbnail ${idx + 1}" />`;
        thumbBtn.addEventListener('click', () => renderQvGallery(idx));
        qvThumbnails.appendChild(thumbBtn);

        const dotBtn = document.createElement('button');
        dotBtn.type = 'button';
        dotBtn.setAttribute('aria-label', `Go to image ${idx + 1}`);
        dotBtn.addEventListener('click', () => renderQvGallery(idx));
        qvDots.appendChild(dotBtn);
      });

      qvQtyInput.value = 1;
      renderQvGallery(0);

      // Animate Modal Open
      qvModal.classList.remove('opacity-0', 'pointer-events-none');
      qvModal.classList.add('opacity-100');
      qvPanel.classList.remove('scale-95', 'translate-y-3');
      qvPanel.classList.add('scale-100', 'translate-y-0');
      document.body.style.overflow = 'hidden';
    }

    function closeQuickview() {
      qvModal.classList.add('opacity-0', 'pointer-events-none');
      qvModal.classList.remove('opacity-100');
      qvPanel.classList.add('scale-95', 'translate-y-3');
      qvPanel.classList.remove('scale-100', 'translate-y-0');
      document.body.style.overflow = '';
    }

    // Attach click listeners to every eyeball button
    document.querySelectorAll('.quickview-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        if (card) openQuickview(card);
      });
    });

    qvCloseBtn.addEventListener('click', closeQuickview);
    qvModal.addEventListener('click', (e) => {
      if (e.target === qvModal) closeQuickview();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickview();
    });

    document.getElementById('qv-qty-minus').addEventListener('click', () => {
      const current = parseInt(qvQtyInput.value, 10) || 1;
      if (current > 1) qvQtyInput.value = current - 1;
    });
    document.getElementById('qv-qty-plus').addEventListener('click', () => {
      const current = parseInt(qvQtyInput.value, 10) || 1;
      qvQtyInput.value = current + 1;
    });

  