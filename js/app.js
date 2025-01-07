document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  function toggleNav() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  }

  function closeNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }

  hamburger.addEventListener('click', toggleNav);

  // Handle dropdown menus
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
      closeNav();
    }
  });

  // Devotional Loading
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

  // Prayer Form
  const prayerForm = document.getElementById('prayer-form');
  const requestTypeSelect = document.getElementById('request-type');
  const counselingOptions = document.getElementById('counseling-options');

  requestTypeSelect?.addEventListener('change', (e) => {
    if (counselingOptions) {
      counselingOptions.style.display = e.target.value === 'counseling' ? 'block' : 'none';
    }
  });

  function validateForm(formData) {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!formData.request.trim()) return 'Please enter your request';
    if (formData.requestType === 'counseling' && !formData.preferredTime) {
      return 'Please select a preferred time slot';
    }
    return null;
  }

  prayerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      requestType: requestTypeSelect.value,
      request: document.getElementById('prayer-request').value,
      preferredTime: document.querySelector('input[name="time-slot"]:checked')?.value
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
      if (counselingOptions) {
        counselingOptions.style.display = 'none';
      }
    } catch (error) {
      alert(error.message || 'Failed to submit request. Please try again.');
      console.error('Submission error:', error);
    }
  });

  // Articles
  async function loadArticles() {
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/articles');
      const articles = await response.json();
      const articlesList = document.getElementById('articles-list');
      
      if (articlesList) {
        articlesList.innerHTML = articles.map(article => `
          <li onclick="openModal(${JSON.stringify(article).replace(/"/g, '&quot;')})">
            <h3>${article.title}</h3>
            <p>${article.summary?.substring(0, 100) || ''}...</p>
          </li>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      if (document.getElementById('articles-list')) {
        document.getElementById('articles-list').innerHTML = 
          '<li>Unable to load articles. Please try again later.</li>';
      }
    }
  }

  loadArticles();

  // Modal handling
  window.openModal = (articleData) => {
    try {
      const article = typeof articleData === 'string' ? JSON.parse(articleData) : articleData;
      const modal = document.getElementById('articleModal');
      
      if (modal) {
        document.getElementById('modalTitle').textContent = article.title || '';
        document.getElementById('modalCategory').textContent = article.category || 'Uncategorized';
        document.getElementById('modalSummary').textContent = article.summary || '';
        document.getElementById('modalContent').textContent = article.content || '';
        modal.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error displaying article:', error);
      alert('Unable to display article content. Please try again.');
    }
  };

  window.closeModal = () => {
    const modal = document.getElementById('articleModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  // Modal click outside
  document.getElementById('articleModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });

  // Read more button
  document.getElementById('read-more-btn')?.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/about-church');
      const data = await response.json();
      alert(data.description || 'Church information will be updated soon.');
    } catch (error) {
      console.error('Error fetching church info:', error);
      alert('Unable to load church information. Please try again later.');
    }
  });

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeNav();
    }
  });
});