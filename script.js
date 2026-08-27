document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Sticky Header Scroll Event
    // ==========================================
    const header = document.querySelector('.header');
    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check


    // ==========================================
    // Mobile Drawer Navigation
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // ==========================================
    // FAQ Accordion
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Close all active FAQ items first for accordion behavior
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = '0';
            });

            if (!isActive) {
                faqItem.classList.add('active');
                // Set max-height dynamically based on scrollHeight
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });


    // ==========================================
    // Lead Capture Form Submission (Contact Form)
    // ==========================================
    const leadForm = document.getElementById('leadForm');
    const formSuccessMessage = document.getElementById('formSuccessMessage');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const emailAddress = document.getElementById('emailAddress').value.trim();
            const plotSize = document.getElementById('plotSize').value;
            const userMessage = document.getElementById('userMessage').value.trim();

            // Simple validation check
            if (!fullName || !phoneNumber || !plotSize) {
                alert('Please fill out all required fields.');
                return;
            }

            // Simple 10 digit phone check (Indian standard format)
            const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
            if (cleanPhone.length < 10) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            // Save lead details locally as mock submission trace
            const leadData = {
                id: 'lead_' + Date.now(),
                fullName,
                phoneNumber: cleanPhone,
                emailAddress,
                plotSize,
                userMessage,
                timestamp: new Date().toISOString()
            };

            const existingLeads = JSON.parse(localStorage.getItem('merloam_leads') || '[]');
            existingLeads.push(leadData);
            localStorage.setItem('merloam_leads', JSON.stringify(existingLeads));

            console.log('Lead submitted successfully:', leadData);

            // UI feedback transition
            leadForm.classList.add('hidden');
            formSuccessMessage.classList.remove('hidden');
        });
    }


    // ==========================================
    // Brochure Download Modal Logic
    // ==========================================
    const brochureModal = document.getElementById('brochureModal');
    const openModalBtns = document.querySelectorAll('.open-brochure-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const brochureForm = document.getElementById('brochureForm');
    const modalSuccessMessage = document.getElementById('modalSuccessMessage');

    const showModal = () => {
        brochureModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Reset form states inside modal
        if (brochureForm) {
            brochureForm.reset();
            brochureForm.classList.remove('hidden');
        }
        if (modalSuccessMessage) {
            modalSuccessMessage.classList.add('hidden');
        }
    };

    const hideModal = () => {
        brochureModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', showModal);
    });

    closeModalBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside of modal content
    brochureModal.addEventListener('click', (e) => {
        if (e.target === brochureModal) {
            hideModal();
        }
    });

    // Brochure download submission handler
    if (brochureForm) {
        brochureForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('modalName').value.trim();
            const phone = document.getElementById('modalPhone').value.trim();
            const email = document.getElementById('modalEmail').value.trim();

            if (!name || !phone) {
                alert('Please fill out all required fields.');
                return;
            }

            const cleanPhone = phone.replace(/[^0-9]/g, '');
            if (cleanPhone.length < 10) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            const brochureRequest = {
                id: 'brochure_' + Date.now(),
                name,
                phone: cleanPhone,
                email,
                timestamp: new Date().toISOString()
            };

            const existingRequests = JSON.parse(localStorage.getItem('merloam_brochure_requests') || '[]');
            existingRequests.push(brochureRequest);
            localStorage.setItem('merloam_brochure_requests', JSON.stringify(existingRequests));

            console.log('Brochure request logged:', brochureRequest);

            // Trigger actual brochure PDF download
            brochureForm.classList.add('hidden');
            modalSuccessMessage.classList.remove('hidden');

            setTimeout(() => {
                const link = document.createElement('a');
                link.href = 'assets/Park Town Brochure.pdf';
                link.download = 'Park Town Brochure.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 1000);
        });
    }

    // ==========================================
    // Scroll Reveal Animation (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.stat-card, .about-text, .about-image-wrapper, .amenity-card, .proximity-item, .pricing-card, .faq-item, .contact-info-panel, .contact-form-panel');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Add base styles for animations
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(35px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            
            // Inline style dynamically resolved by css class
            const style = document.createElement('style');
            style.innerHTML = `
                .reveal-active {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
            
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    // ==========================================
    // Lightbox Gallery Logic
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightboxModal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img-thumb');
                const title = item.querySelector('.gallery-info h4').textContent;
                const desc = item.querySelector('.gallery-info p').textContent;

                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = `<strong>${title}</strong> - ${desc}`;
                lightboxModal.style.display = 'flex';
                setTimeout(() => {
                    lightboxModal.classList.add('open');
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('open');
            setTimeout(() => {
                lightboxModal.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }
});
