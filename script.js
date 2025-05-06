// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to current page in navigation
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Add animation to gallery items on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.gallery-item, .setup-item, .feature').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
});

// Image Viewer Functionality
const setupImages = {
    dome: ['pics/s1.jpg', 'pics/s4.jpg', 'pics/s2.jpg', 'pics/s5.jpg'],
    modern: ['pics/p1.jpg', 'pics/s3.jpg', 'pics/p2.jpg', 'pics/x3.jpg'],
    luxury: ['pics/1cc.jpg', 'pics/1bb.jpg', 'pics/1w.jpg', 'pics/frontal.jpg'],
    minimal: ['pics/m4.jpg', 'pics/y1.jpg', 'pics/3zb.jpg', 'pics/3zc.jpg'],
    professional: ['pics/w1.jpg', 'pics/3c.jpg', 'pics/y4.jpg', 'pics/m1.jpg']
};

let currentSetup = '';
let currentImageIndex = 0;

// Open image viewer
document.querySelectorAll('.view-more-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const setupItem = e.target.closest('.setup-item');
        currentSetup = setupItem.dataset.setup;
        currentImageIndex = 0;
        openImageViewer();
    });
});

// Close image viewer
document.querySelector('.close-btn').addEventListener('click', closeImageViewer);

// Navigation buttons
document.querySelector('.prev-btn').addEventListener('click', showPreviousImage);
document.querySelector('.next-btn').addEventListener('click', showNextImage);

function openImageViewer() {
    const viewer = document.getElementById('imageViewer');
    const mainImage = viewer.querySelector('.main-image img');
    const thumbnailContainer = viewer.querySelector('.thumbnail-container');
    
    // Set main image
    mainImage.src = setupImages[currentSetup][currentImageIndex];
    
    // Create thumbnails
    thumbnailContainer.innerHTML = '';
    setupImages[currentSetup].forEach((src, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = src;
        thumbnail.classList.add('thumbnail');
        if (index === currentImageIndex) {
            thumbnail.classList.add('active');
        }
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateViewer();
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
    const viewer = document.getElementById('imageViewer');
    viewer.classList.remove('active');
    document.body.style.overflow = '';
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + setupImages[currentSetup].length) % setupImages[currentSetup].length;
    updateViewer();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % setupImages[currentSetup].length;
    updateViewer();
}

function updateViewer() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = setupImages[currentSetup][currentImageIndex];
    
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

// Close viewer when clicking outside
document.getElementById('imageViewer').addEventListener('click', (e) => {
    if (e.target.id === 'imageViewer') {
        closeImageViewer();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('imageViewer').classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeImageViewer();
            break;
        case 'ArrowLeft':
            showPreviousImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
});