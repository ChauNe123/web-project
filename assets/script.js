document.addEventListener('DOMContentLoaded', () => {
    console.log("Script đã tải thành công!");

    // ====================================================
    // 1. TOP BAR DROPDOWN LOGIC
    // ====================================================
    const dropdowns = document.querySelectorAll('.top-bar-links .dropdown');

    function closeAllDropdowns(exceptThisOne = null) {
        dropdowns.forEach(dropdown => {
            if (dropdown !== exceptThisOne) {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('show');
            }
        });
    }

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllDropdowns(dropdown);
                menu.classList.toggle('show');
            });
        }
    });

    window.addEventListener('click', () => closeAllDropdowns());


    // ====================================================
    // 2. SCROLL EFFECT (ẨN TOPBAR / STICKY HEADER)
    // ====================================================
    const topBar = document.getElementById("topBar");
    const mainHeader = document.querySelector(".main-header");
    let lastScrollY = window.scrollY;

    if (topBar && mainHeader) {
        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                topBar.classList.add("hide");
                mainHeader.classList.add("up");
            } else if (currentScrollY < lastScrollY) {
                topBar.classList.remove("hide");
                mainHeader.classList.remove("up");
            }
            lastScrollY = currentScrollY;
        });
    }


    // ====================================================
    // 3. MOBILE MENU TOGGLE
    // ====================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    function checkMobileMenu() {
        if (!menuToggle || !mainNav) return;
        if (window.innerWidth <= 900) {
            menuToggle.style.display = 'block';
            mainNav.classList.remove('open');
        } else {
            menuToggle.style.display = 'none';
            mainNav.classList.remove('open');
        }
    }

    if (menuToggle && mainNav) {
        checkMobileMenu();
        window.addEventListener('resize', checkMobileMenu);
        menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
    }


    // ====================================================
    // 4. HERO SLIDER
    // ====================================================
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const heroImgs = heroSlider.querySelectorAll('img');
        const leftBtn = heroSlider.querySelector('.hero-arrow.left');
        const rightBtn = heroSlider.querySelector('.hero-arrow.right');
        
        if(heroImgs.length > 0 && leftBtn && rightBtn) {
            let heroIdx = 0;
            let heroTimer = null;
            let isSliding = false;

            // Setup active ban đầu
            const initialActive = heroSlider.querySelector('img.active');
            if (initialActive) {
                heroIdx = Array.from(heroImgs).indexOf(initialActive);
            } else {
                heroImgs[0].classList.add('active');
                heroIdx = 0;
            }

            function showSlide(newIdx, direction = 1) {
                if (isSliding || newIdx === heroIdx || !heroImgs[newIdx]) return;
                isSliding = true;

                const oldIdx = heroIdx;
                const outClass = direction === 1 ? 'slide-out-left' : 'slide-out-right';
                const inClass = direction === 1 ? 'slide-in-right' : 'slide-in-left';
                const oldSlide = heroImgs[oldIdx];
                const newSlide = heroImgs[newIdx];

                newSlide.classList.add(inClass);

                // Force reflow (optional hack if animation stuck)
                void newSlide.offsetWidth;

                setTimeout(() => {
                    newSlide.classList.add('active');
                    newSlide.classList.remove(inClass);
                    oldSlide.classList.remove('active');
                    oldSlide.classList.add(outClass);
                }, 10);

                setTimeout(() => {
                    oldSlide.classList.remove(outClass);
                    heroIdx = newIdx;
                    isSliding = false;
                }, 700);
            }

            rightBtn.addEventListener('click', () => showSlide((heroIdx + 1) % heroImgs.length, 1));
            leftBtn.addEventListener('click', () => showSlide((heroIdx - 1 + heroImgs.length) % heroImgs.length, 0));

            function autoSlide() {
                heroTimer = setInterval(() => showSlide((heroIdx + 1) % heroImgs.length, 1), 3500);
            }
            autoSlide();
            heroSlider.addEventListener('mouseenter', () => clearInterval(heroTimer));
            heroSlider.addEventListener('mouseleave', autoSlide);
        }
    }


    // ====================================================
    // 5. COUNTERS ANIMATION
    // ====================================================
    const counters = document.querySelectorAll('.counter');
    const counterSection = document.querySelector('.counters');
    
    if (counterSection && counters.length > 0) {
        let hasAnimated = false;
        const speed = 200;

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        window.addEventListener('scroll', () => {
            const sectionPos = counterSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.3;
            if (sectionPos < screenPos && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        });
    }


    // ====================================================
    // 6. CLIENTS SLIDER
    // ====================================================
    const customerContainer = document.querySelector('.customer-slider');
    const customerTrack = document.querySelector('.owl-carousel-clients-carousel');

    if (customerContainer && customerTrack) {
        const customerSlides = customerTrack.querySelectorAll('.customer-slide');
        const customerLeft = document.querySelector('.customer-arrow.left');
        const customerRight = document.querySelector('.customer-arrow.right');

        if (customerSlides.length > 0 && customerLeft && customerRight) {
            let customerIdx = 0;
            const originalSlidesCount = customerSlides.length;
            const transitionTime = 600;
            let visibleSlides = 4;
            let slideWidth = 0;

            function calculateMetrics() {
                if (!customerSlides[0]) return;
                slideWidth = customerSlides[0].offsetWidth + 32; 
                if (slideWidth <= 32) return;

                const containerWidth = customerContainer.offsetWidth;
                visibleSlides = Math.max(1, Math.floor(containerWidth / slideWidth));

                customerTrack.querySelectorAll('.clone').forEach(clone => clone.remove());
                for (let i = 0; i < visibleSlides; i++) {
                    if (customerSlides[i]) {
                        const clone = customerSlides[i].cloneNode(true);
                        clone.classList.add('clone');
                        customerTrack.appendChild(clone);
                    }
                }
            }

            function updateCustomerSlider(isTeleport = false) {
                if (slideWidth <= 32) {
                    calculateMetrics();
                    if (slideWidth <= 32) return;
                }
                if (isTeleport) {
                    customerTrack.style.transition = 'none';
                } else {
                    customerTrack.style.transition = `transform ${transitionTime}ms cubic-bezier(0.4,0,0.2,1)`;
                }
                customerTrack.style.transform = `translateX(-${customerIdx * slideWidth}px)`;
            }

            customerRight.addEventListener('click', () => {
                if (customerIdx < originalSlidesCount - visibleSlides) {
                    customerIdx++;
                } else {
                    customerIdx = 0;
                }
                updateCustomerSlider();
            });

            customerLeft.addEventListener('click', () => {
                if (customerIdx > 0) {
                    customerIdx--;
                } else {
                    customerIdx = originalSlidesCount - visibleSlides;
                }
                updateCustomerSlider();
            });

            // Auto Run
            setInterval(() => {
                customerIdx++;
                updateCustomerSlider(false);
                if (customerIdx === originalSlidesCount) {
                    setTimeout(() => {
                        customerIdx = 0;
                        updateCustomerSlider(true);
                    }, transitionTime);
                }
            }, 3500);

            setTimeout(calculateMetrics, 100);
            window.addEventListener('resize', calculateMetrics);
        }
    }


    // ====================================================
    // 7. VIDEO CALL SUPPORT (ĐÃ FIX LỖI CRASH)
    // ====================================================
    const btnCallSupport = document.getElementById('btnCallSupport');
    const videoModal = document.getElementById('videoModal');
    const btnCloseVideo = document.getElementById('btnCloseVideo');
    const btnSendChat = document.getElementById('btnSendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    // Chỉ chạy khi có nút Gọi và Modal
    if (btnCallSupport && videoModal) {
        
        btnCallSupport.addEventListener('click', () => {
            videoModal.style.display = 'flex';
            const vid = document.getElementById('agentVideo');
            if(vid) { 
                vid.muted = false; 
                vid.play().catch(e => console.log("User chưa tương tác, video muted")); 
            }
        });

        if (btnCloseVideo) {
            btnCloseVideo.addEventListener('click', () => {
                videoModal.style.display = 'none';
                const vid = document.getElementById('agentVideo');
                if(vid) vid.pause();
            });
        }

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) videoModal.style.display = 'none';
        });
    }

    // Logic Chat (Tách riêng để không gây lỗi nếu thiếu nút Chat)
    if (btnSendChat && chatInput && chatMessages) {
        function sendMessage() {
            const text = chatInput.value.trim();
            if (text !== "") {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', 'user-msg');
                msgDiv.innerText = text;
                chatMessages.appendChild(msgDiv);
                chatInput.value = "";
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }

        btnSendChat.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') sendMessage(); 
        });
    }


    // ====================================================
    // 8. LOGIC NÚT LIÊN HỆ THÔNG MINH (SMART DOCK - FIX SMOOTH)
    // ====================================================
    const contactDock = document.getElementById('contactDock');
    const floatingGroup = document.getElementById('floatingGroup');

    if (contactDock && floatingGroup) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // KHI THẤY CHÂN TRANG (HẠ CÁNH)
                    // 1. Gỡ chế độ bay
                    floatingGroup.classList.remove('is-floating');
                    // 2. Thêm chế độ hạ cánh (để kích hoạt animation CSS softLanding)
                    floatingGroup.classList.add('is-docked');
                } else {
                    // KHI CUỘN LÊN (BAY)
                    // 1. Thêm chế độ bay
                    floatingGroup.classList.add('is-floating');
                    // 2. Gỡ chế độ hạ cánh
                    floatingGroup.classList.remove('is-docked');
                }
            });
        }, {
            root: null,
            threshold: 0.1 // Giữ nguyên độ nhạy
        });

        observer.observe(contactDock);
    } else {
        console.warn("Chưa thấy ID trong HTML footer.");
    }
});