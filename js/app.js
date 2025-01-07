document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Handle dropdown menus on mobile
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });

  // Load daily devotional
  async function loadDevotional() {
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/devotional');
      const data = await response.json();
      document.getElementById('devotional-title').textContent = data.title || 'Daily Devotional';
      document.getElementById('devotional-body').textContent = data.content || 'Content will be updated shortly.';
    } catch (error) {
      console.error('Error loading devotional:', error);
      document.getElementById('devotional-title').textContent = 'Daily Devotional';
      document.getElementById('devotional-body').textContent = 'Please check back later.';
    }
  }

  loadDevotional();

  // Prayer form handling
  const prayerForm = document.getElementById('prayer-form');
  const requestTypeSelect = document.getElementById('request-type');
  const counselingOptions = document.getElementById('counseling-options');

  requestTypeSelect.addEventListener('change', (e) => {
    counselingOptions.style.display = e.target.value === 'counseling' ? 'block' : 'none';
  });

  // Form validation
  function validateForm(formData) {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!formData.request.trim()) return 'Please enter your request';
    if (formData.requestType === 'counseling' && !formData.preferredTime) {
      return 'Please select a preferred time slot';
    }
    return null;
  }

  prayerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      requestType: requestTypeSelect.value,
      request: document.getElementById('prayer-request').value,
      preferredTime: document.querySelector('input[name="time-slot"]:checked')?.value || null
    };

    const validationError = validateForm(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      alert('Request submitted successfully!');
      prayerForm.reset();
      counselingOptions.style.display = 'none';
      
    } catch (error) {
      alert(error.message || 'Failed to submit request. Please try again.');
      console.error('Submission error:', error);
    }
  });

  // Articles handling
  async function loadArticles() {
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/articles');
      const articles = await response.json();
      const articlesList = document.getElementById('articles-list');
      
      articlesList.innerHTML = articles.map(article => `
        <li onclick="openModal('${article.id}')">
          <h3>${article.title}</h3>
          <p>${article.summary.substring(0, 100)}...</p>
        </li>
      `).join('');
      
    } catch (error) {
      console.error('Error loading articles:', error);
      document.getElementById('articles-list').innerHTML = 
        '<li>Unable to load articles. Please try again later.</li>';
    }
  }

  loadArticles();

  // Modal handling
  window.openModal = async (articleId) => {
    try {
      const response = await fetch(`https://wogsa-backend.onrender.com/api/articles/${articleId}`);
      const article = await response.json();
      
      document.getElementById('modalTitle').textContent = article.title;
      document.getElementById('modalCategory').textContent = article.category;
      document.getElementById('modalSummary').textContent = article.summary;
      document.getElementById('modalContent').textContent = article.content;
      document.getElementById('articleModal').style.display = 'flex';
      
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Unable to load article. Please try again.');
    }
  };

  window.closeModal = () => {
    document.getElementById('articleModal').style.display = 'none';
  };

  // Close modal when clicking outside
  document.getElementById('articleModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });

  // Read more button
  document.getElementById('read-more-btn').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/about-church');
      const data = await response.json();
      alert(data.description || 'Church information will be updated soon.');
    } catch (error) {
      console.error('Error fetching church info:', error);
      alert('Unable to load church information. Please try again later.');
    }
  });

  // Handle escape key for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});