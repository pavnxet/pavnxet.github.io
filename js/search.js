document.addEventListener('DOMContentLoaded', () => {
  let searchData = [];
  let selectedIndex = -1;

  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchInput || !searchResults) return;

  // Fetch search index
  fetch('data/search-index.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
    })
    .catch(error => console.error('Error loading search index:', error));

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    selectedIndex = -1;

    if (!query) {
      searchResults.classList.remove('active');
      return;
    }

    const results = searchData.filter(post => {
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchDesc = post.description.toLowerCase().includes(query);
      const matchTags = post.tags && post.tags.some(tag => tag.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchTags;
    });

    renderResults(results);
  });

  searchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (!searchResults.classList.contains('active') || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        window.location.href = items[selectedIndex].getAttribute('href');
      } else if (items.length > 0) {
        window.location.href = items[0].getAttribute('href');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });

  function renderResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found.</div>';
    } else {
      results.forEach((result, idx) => {
        const a = document.createElement('a');
        a.href = result.url;
        a.className = 'search-result-item';
        
        const title = document.createElement('div');
        title.className = 'search-result-title';
        title.textContent = result.title;
        
        const desc = document.createElement('div');
        desc.className = 'search-result-desc';
        desc.textContent = result.description;
        
        a.appendChild(title);
        a.appendChild(desc);
        searchResults.appendChild(a);
      });
    }
    
    searchResults.classList.add('active');
  }

  function updateSelection(items) {
    items.forEach(item => item.classList.remove('selected'));
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].classList.add('selected');
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }
});
