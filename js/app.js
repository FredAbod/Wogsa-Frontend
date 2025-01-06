document.addEventListener('DOMContentLoaded', () => {
    // Load daily devotional
    fetch('https://wogsa-backend.onrender.com/api/devotional')
      .then(response => response.json())
      .then(data => {
        document.getElementById('devotional-title').textContent = data.title || 'No devotional available.';
        document.getElementById('devotional-body').textContent = data.content || '';
      });
  
    // Prayer form handling
    const prayerForm = document.getElementById('prayer-form');
    const requestTypeSelect = document.getElementById('request-type');
    const counselingOptions = document.getElementById('counseling-options');
  
    requestTypeSelect.addEventListener('change', (e) => {
      counselingOptions.style.display = e.target.value === 'counseling' ? 'block' : 'none';
    });
  
    prayerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      try {
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          requestType: document.getElementById('request-type').value,
          request: document.getElementById('prayer-request').value,
          preferredTime: document.querySelector('.time-slot.selected')?.textContent || null
        };
  
        const response = await fetch('https://wogsa-backend.onrender.com/api/prayer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        alert(data.message || 'Request submitted successfully!');
        prayerForm.reset();
        document.querySelector('.time-slot.selected')?.classList.remove('selected');
      } catch (error) {
        alert(error.message || 'Failed to submit request. Please try again.');
        console.error('Submission error:', error);
      }
    });
  
    // Time slot selection
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
  
    // Load articles
// Fetch articles from the API
fetch('https://wogsa-backend.onrender.com/api/articles') // Replace with your API endpoint
  .then((response) => response.json())
  .then((data) => {
    const articlesList = document.getElementById('articles-list');

    // Populate the list dynamically
    data.forEach((article) => {
      const listItem = document.createElement('li');
      listItem.textContent = article.title;
      listItem.onclick = () => openModal(article);
      articlesList.appendChild(listItem);
    });
  })
  .catch((error) => {
    console.error('Error fetching articles:', error);
  });

  function closeModal() {
    console.log("closeModal function triggered");
    document.getElementById("articleModal").style.display = "none";
  }
  
  // Attach to global scope for inline onclick
  window.closeModal = closeModal;
  
  // Function to open the modal with article details
  function openModal(article) {
    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalSummary').innerText = article.summary;
    document.getElementById('modalContent').innerText = article.content;
    document.getElementById('modalCategory').innerText = article.category;
    document.getElementById('articleModal').style.display = 'flex';
  }
  

  
    // Read more about church
    document.getElementById('read-more-btn').addEventListener('click', () => {
      fetch('/api/about-church')
        .then((response) => response.json())
        .then((data) => {
          alert(`About the Church: ${data.description}`);
        })
        .catch((error) => console.error('Error fetching data:', error));
    });
  });
  
  // Article functions
  function showArticle(article) {
    document.getElementById('articles-list').classList.add('hidden');
    document.getElementById('article-details').classList.remove('hidden');
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-content').textContent = article.content;
  }
  
//   function closeArticle() {
//     document.getElementById('articles-list').classList.remove('hidden');
//     document.getElementById('article-details').classList.add('hidden');
//   }

document.getElementById('request-type').addEventListener('change', function () {
    const counselingOptions = document.getElementById('counseling-options');
    if (this.value === 'counseling') {
      counselingOptions.style.display = 'block';
    } else {
      counselingOptions.style.display = 'none';
    }
  });
  
  document.getElementById('prayer-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission for testing purposes
    alert('Request submitted successfully!');
  });
  