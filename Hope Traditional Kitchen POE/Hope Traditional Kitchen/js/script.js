// Accordion
document.addEventListener('DOMContentLoaded', function () {
    var acc = document.querySelectorAll('.accordion');
    acc.forEach(function (btn) {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
});

// Lightbox
document.addEventListener('DOMContentLoaded', function () {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<span class="close-lightbox">&times;</span><img class="lightbox-content" id="lightbox-img">';
    document.body.appendChild(box);

    var img = document.getElementById('lightbox-img');
    var close = box.querySelector('.close-lightbox');

    document.querySelectorAll('.gallery-item').forEach(function (g) {
        g.addEventListener('click', function () {
            box.style.display = 'block';
            img.src = this.src;
            img.alt = this.alt;
        });
    });

    close.addEventListener('click', function () { box.style.display = 'none'; });
    box.addEventListener('click', function (e) { if (e.target === box) box.style.display = 'none'; });
});

// Dynamic Menu Loading
document.addEventListener('DOMContentLoaded', function () {
    var menuContainer = document.getElementById('dynamic-menu');
    if (!menuContainer) return;

    // Menu Data
    var menuItems = [
        { name: 'Vetkoek with Mince', desc: 'Golden fried dough filled with savoury minced meat.', price: 'R45', cat: 'Starters', img: 'images/gwinyamince.jpg' },
        { name: 'Chicken Livers', desc: 'Pan-fried chicken livers in a rich Peri-Peri sauce.', price: 'R55', cat: 'Starters', img: 'images/chickenlivers.jpg' },
        { name: 'Samp and Beans', desc: 'Traditional samp and beans cooked until soft.', price: 'R40', cat: 'Starters', img: 'images/sampandbeans.jpg' },
        { name: 'Pap and Stew', desc: 'Soft maize meal pap served with rich stew.', price: 'R85 - R110', cat: 'Main Courses', img: 'images/papandstew.jpg' },
        { name: 'Braai Platter', desc: 'Selection of grilled meats with sides.', price: 'R280', cat: 'Main Courses', img: 'images/braaiplatter.jpg' },
        { name: 'Morogo and Pap', desc: 'Wild spinach cooked with onion and tomato.', price: 'R75', cat: 'Main Courses', img: 'images/morogoandpap.jpg' },
        { name: 'Oxtail Stew', desc: 'Slow-cooked oxtail in a rich gravy.', price: 'R145', cat: 'Main Courses', img: 'images/oxtailstew.jpg' }
    ];

    // Clear container
    menuContainer.innerHTML = '';

    // Render items
    menuItems.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'menu-card';
        li.dataset.name = item.name.toLowerCase();
        li.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="gallery-item" width="300" height="200">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <p><strong>Price: ${item.price}</strong></p>
        `;
        menuContainer.appendChild(li);
    });

    // Re-attach lightbox to newly created images
    document.querySelectorAll('.gallery-item').forEach(function (g) {
        g.addEventListener('click', function () {
            var lb = document.querySelector('.lightbox');
            var lbImg = document.getElementById('lightbox-img');
            if (lb) {
                lb.style.display = 'block';
                lbImg.src = this.src;
                lbImg.alt = this.alt;
            }
        });
    });
});

// Search Filter
document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('menuSearch');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', function () {
        var val = this.value.toLowerCase();
        document.querySelectorAll('.menu-card').forEach(function (card) {
            var name = card.dataset.name || '';
            card.style.display = name.includes(val) ? 'block' : 'none';
        });
    });
});

// Enquiry Form AJAX
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('fullname').value.trim();
        var email = document.getElementById('email').value.trim();
        var msg = document.getElementById('message').value.trim();

        var ok = true;
        document.querySelectorAll('.error-msg').forEach(el => el.remove());

        if (name.length < 2) { showError('fullname', 'Enter your name'); ok = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Enter valid email'); ok = false; }
        if (msg.length < 5) { showError('message', 'Enter a message'); ok = false; }

        if (!ok) return;

        // AJAX Submission
        fetch('https://httpbin.org/post', { method: 'POST', body: new FormData(form) })
        .then(() => {
            document.getElementById('enquiryResponse').style.display = 'block';
            document.getElementById('enquiryResponse').innerHTML = '✅ Thank you, ' + name + '! Your enquiry has been sent.';
            form.style.display = 'none';
        });
    });

    function showError(id, msg) {
        var el = document.getElementById(id);
        var span = document.createElement('span');
        span.className = 'error-msg';
        span.textContent = msg;
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
    }
});

// Contact Form AJAX
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();

        var ok = true;
        document.querySelectorAll('.error-msg').forEach(el => el.remove());

        if (name.length < 2) { showError('name', 'Enter your name'); ok = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Enter valid email'); ok = false; }
        if (message.length < 5) { showError('message', 'Enter a message'); ok = false; }

        if (!ok) return;

        // AJAX Submission
        fetch('https://httpbin.org/post', { method: 'POST', body: new FormData(form) })
        .then(() => {
            // Compile the email content
            var subject = 'Website Contact from ' + name;
            var body = 'Name: ' + name + '%0D%0AEmail: ' + email + '%0D%0A%0D%0AMessage:%0D%0A' + message;
            
            // Show success message with clickable email link
            document.getElementById('contactResponse').style.display = 'block';
            document.getElementById('contactResponse').innerHTML = 
                '✅ Thank you, ' + name + '!<br><br>' +
                'Your message is ready. Click the button below to send it to us:<br><br>' +
                '<a href="mailto:info@hopetraditionalkitchen.co.za?subject=' + encodeURIComponent(subject) + '&body=' + body + '" style="background: #a0522d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">📧 Send Email</a>';
            
            form.style.display = 'none';
        });
    });

    function showError(id, msg) {
        var el = document.getElementById(id);
        var span = document.createElement('span');
        span.className = 'error-msg';
        span.textContent = msg;
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
    }
});

// Leaflet Map
document.addEventListener('DOMContentLoaded', function () {
    var mapEl = document.getElementById('map');
    if (mapEl && typeof L !== 'undefined') {
        var map = L.map('map').setView([-23.9045, 29.4689], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([-23.9024, 29.4774]).addTo(map).bindPopup('<b>Main Restaurant</b><br>Polokwane Central');
        L.marker([-23.885, 29.385]).addTo(map).bindPopup('<b>Second Branch</b><br>Seshego');
    }
});