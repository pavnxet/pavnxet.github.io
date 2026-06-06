// Dashboard Application Script
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-bottom-item");
  const contentPanels = document.querySelectorAll(".content-panel");
  const mainContent = document.getElementById("main-content");

  // Stats
  const statActiveProjects = document.getElementById("stat-active-projects");
  const statBlogPosts = document.getElementById("stat-blog-posts");

  // Overview containers
  const overviewProjectsContainer = document.getElementById("overview-projects-container");
  const overviewBlogContainer = document.getElementById("overview-blog-container");

  // Projects Showcase
  const projectsGridContainer = document.getElementById("projects-grid-container");
  const projectFilterPills = document.querySelectorAll("#project-filters .filter-pill");

  // Blog Feed
  const blogGridContainer = document.getElementById("blog-grid-container");
  const blogFilterPills = document.querySelectorAll("#blog-filters .filter-pill");
  const blogSearchInput = document.getElementById("blog-search");

  // Article Reader Modal
  const readerModal = document.getElementById("reader-modal");
  const readerCloseBtn = document.getElementById("reader-close-btn");
  const readerTitle = document.getElementById("reader-title");
  const readerCategory = document.getElementById("reader-category");
  const readerDate = document.getElementById("reader-date");
  const readerTime = document.getElementById("reader-time");
  const readerImage = document.getElementById("reader-image");
  const readerContent = document.getElementById("reader-content");

  // --- Initialize App ---
  function init() {
    updateStats();
    renderOverview();
    renderProjects("all");
    renderBlog("all", "");
    setupTabNavigation();
    setupFilters();
    setupSearch();
    setupModal();
    setupOverviewTriggers();
  }

  // --- Stats Handling ---
  function updateStats() {
    if (statActiveProjects) {
      statActiveProjects.textContent = projectsData.length;
    }
    if (statBlogPosts) {
      statBlogPosts.textContent = blogData.length;
    }
  }

  // --- Tab Navigation ---
  function setupTabNavigation() {
    // Desktop Nav Items
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = item.getAttribute("data-tab");
        switchTab(tabId);
      });
    });

    // Mobile Bottom Nav Items
    mobileNavItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = item.getAttribute("data-tab");
        switchTab(tabId);
      });
    });
  }

  function switchTab(tabId) {
    // 1. Update Desktop Sidebar active states
    navItems.forEach(nav => {
      if (nav.getAttribute("data-tab") === tabId) {
        nav.classList.add("active");
      } else {
        nav.classList.remove("active");
      }
    });

    // 2. Update Mobile Bottom Nav active states
    mobileNavItems.forEach(nav => {
      if (nav.getAttribute("data-tab") === tabId) {
        nav.classList.add("active");
      } else {
        nav.classList.remove("active");
      }
    });

    // 3. Switch visible panel
    contentPanels.forEach(panel => {
      const panelId = panel.getAttribute("id");
      if (panelId === `panel-${tabId}`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // 4. Scroll main content area to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bind links inside the dashboard (e.g. "See all projects", "Read all posts")
  function setupOverviewTriggers() {
    document.querySelectorAll(".nav-trigger").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-target");
        if (targetTab) {
          switchTab(targetTab);
        }
      });
    });
  }

  // --- Rendering Functions ---

  // Render content in the home/overview tab
  function renderOverview() {
    // Render first 2 projects as featured
    overviewProjectsContainer.innerHTML = "";
    const featuredProjects = projectsData.slice(0, 2);
    featuredProjects.forEach(project => {
      const card = createProjectCardElement(project);
      overviewProjectsContainer.appendChild(card);
    });

    // Render latest 3 blog posts in list view rows
    overviewBlogContainer.innerHTML = "";
    const latestBlogs = blogData.slice(0, 3);
    latestBlogs.forEach(post => {
      const row = document.createElement("div");
      row.className = "recent-item-row";
      row.innerHTML = `
        <img src="${post.image}" alt="${post.title}" class="recent-item-img">
        <div class="recent-item-info">
          <div class="recent-item-category">${post.category}</div>
          <h4 class="recent-item-title">${post.title}</h4>
          <span class="recent-item-date">${post.date}</span>
        </div>
      `;
      row.addEventListener("click", () => {
        openArticleReader(post.id);
      });
      overviewBlogContainer.appendChild(row);
    });
  }

  // Render projects tab content
  function renderProjects(filter = "all") {
    projectsGridContainer.innerHTML = "";
    
    const filtered = filter === "all" 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    if (filtered.length === 0) {
      projectsGridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
          <p>No projects found in this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(project => {
      const card = createProjectCardElement(project);
      projectsGridContainer.appendChild(card);
    });
  }

  // Render blog posts tab content
  function renderBlog(filter = "all", searchQuery = "") {
    blogGridContainer.innerHTML = "";
    
    let filtered = blogData;
    
    // Apply category filter
    if (filter !== "all") {
      filtered = filtered.filter(post => post.category === filter);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.description.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      blogGridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
          <p>No articles match your search or filter criteria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(post => {
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        <div class="card-header-image">
          <img src="${post.image}" alt="${post.title}" class="card-image">
          <div class="card-badge-container">
            <span class="card-badge card-category-badge">${post.category}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="blog-card-meta">
            <span>${post.date}</span>
            <span class="blog-meta-dot"></span>
            <span>${post.readTime}</span>
          </div>
          <h3 class="card-title">${post.title}</h3>
          <p class="card-desc">${post.description}</p>
          <span class="blog-read-more">
            Read article
            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; stroke: currentColor; stroke-width: 2.5; fill: none;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      `;
      card.addEventListener("click", () => {
        openArticleReader(post.id);
      });
      blogGridContainer.appendChild(card);
    });
  }

  // Helper function to create project cards
  function createProjectCardElement(project) {
    const card = document.createElement("div");
    card.className = "project-card";
    
    const statusClass = project.status === "Completed" ? "badge-completed" : "badge-ongoing";
    
    card.innerHTML = `
      <div class="card-header-image">
        <img src="${project.image}" alt="${project.title}" class="card-image">
        <div class="card-badge-container">
          <span class="card-badge ${statusClass}">${project.status}</span>
          <span class="card-badge card-category-badge">${project.category}</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${project.title}</h3>
        <p class="card-desc">${project.description}</p>
        <div class="card-tags">
          ${project.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join("")}
        </div>
        <div class="card-actions">
          <a href="${project.codeLink}" target="_blank" class="action-btn-secondary">
            <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            Source
          </a>
          <a href="${project.demoLink}" target="_blank" class="action-btn-primary">
            Live Demo
            <svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        </div>
      </div>
    `;
    return card;
  }

  // --- Filters Handling ---
  function setupFilters() {
    // Project Category Pills
    projectFilterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        projectFilterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        
        const filterVal = pill.getAttribute("data-filter");
        renderProjects(filterVal);
      });
    });

    // Blog Category Pills
    blogFilterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        blogFilterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        
        const filterVal = pill.getAttribute("data-filter");
        const searchVal = blogSearchInput.value;
        renderBlog(filterVal, searchVal);
      });
    });
  }

  // --- Search Handling ---
  function setupSearch() {
    if (blogSearchInput) {
      blogSearchInput.addEventListener("input", (e) => {
        const searchVal = e.target.value;
        // Find active blog filter pill
        const activePill = document.querySelector("#blog-filters .filter-pill.active");
        const filterVal = activePill ? activePill.getAttribute("data-filter") : "all";
        
        renderBlog(filterVal, searchVal);
      });
    }
  }

  // --- Article Reader Modal ---
  function setupModal() {
    // Close modal when close button is clicked
    if (readerCloseBtn) {
      readerCloseBtn.addEventListener("click", closeArticleReader);
    }

    // Close modal when clicking outside of the reading content container
    if (readerModal) {
      readerModal.addEventListener("click", (e) => {
        if (e.target === readerModal) {
          closeArticleReader();
        }
      });
    }

    // Add Escape key handler to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && readerModal.classList.contains("active")) {
        closeArticleReader();
      }
    });
  }

  function openArticleReader(postId) {
    const post = blogData.find(b => b.id === postId);
    if (!post) return;

    // Set modal text and content
    readerTitle.textContent = post.title;
    readerCategory.textContent = post.category;
    readerDate.textContent = post.date;
    readerTime.textContent = post.readTime;
    readerImage.src = post.image;
    readerImage.alt = post.title;
    readerContent.innerHTML = post.content;

    // Show modal by adding class (CSS handles animation transition)
    readerModal.classList.add("active");
    
    // Disable background scroll
    document.body.style.overflow = "hidden";
  }

  function closeArticleReader() {
    readerModal.classList.remove("active");
    
    // Restore background scroll
    document.body.style.overflow = "";
  }

  // Launch initial execution
  init();
});
