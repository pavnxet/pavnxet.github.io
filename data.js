// Web Portfolio & Blog Data
// Easily add, update, or remove projects and blog posts here!

const projectsData = [
  {
    id: "project-devflow",
    title: "DevFlow Dashboard",
    description: "A collaborative Kanban board and sprint planning dashboard designed specifically for developers. Built with custom drag-and-drop mechanics, real-time filters, and dark/cream custom theme switches.",
    category: "Web App",
    status: "Completed",
    image: "assets/project_devflow.png",
    tags: ["HTML5", "CSS Grid", "Vanilla JS", "Local Storage"],
    codeLink: "https://github.com",
    demoLink: "https://github.com"
  },
  {
    id: "project-ecotrack",
    title: "EcoTrack Mobile UI",
    description: "A mobile application interface designed to track green habits, log carbon offsets, and visualize personal sustainability goals. Created with soft leafy colors, intuitive interactive charts, and quick-add widgets.",
    category: "UI/UX Design",
    status: "Ongoing",
    image: "assets/project_ecotrack.png",
    tags: ["Figma", "Mobile UI", "Prototyping", "Design System"],
    codeLink: "https://github.com",
    demoLink: "https://github.com"
  },
  {
    id: "project-aura",
    title: "Aura Soundscape",
    description: "A minimalist ambient sound generator designed for deep work, focus, and relaxation. Features a custom audio engine, smooth floating bubbles to adjust sound mix, and a clean, clutter-free dashboard.",
    category: "Web Tool",
    status: "Completed",
    image: "assets/project_aura.png",
    tags: ["Web Audio API", "CSS Animations", "Vanilla JS", "Audio Engine"],
    codeLink: "https://github.com",
    demoLink: "https://github.com"
  }
];

const blogData = [
  {
    id: "blog-creamy-design",
    title: "The Art of Creamy Web Aesthetics",
    description: "Why modern digital interfaces are shifting away from stark cold whites to warm, soft, low-contrast cream palettes. We analyze key design principles, accessibility, and CSS tokens.",
    category: "Design",
    date: "June 6, 2026",
    readTime: "5 min read",
    image: "assets/blog_creamy_design.png",
    content: `
      <p>For years, the internet has been dominated by two extremes: stark, blinding dark mode whites (#FFF) and cold, high-contrast dark modes (#000). However, a new design aesthetic has quietly taken over the web: <strong>Creamy Light Mode</strong>.</p>
      
      <p>This aesthetic, characterized by soft warm whites, low-contrast grays, and muted gold or brown accents, is more than just a passing trend. It is a response to screen fatigue and a desire for more organic, human, and premium-feeling interfaces.</p>
      
      <h3>1. The Psychology of Warm Tones</h3>
      <p>Pure white (#FFF) displays at maximum brightness, emitting significant blue light. Warm creams and off-whites, such as alabaster (#FDFBF7) and soft sand (#FAF6F0), reflect a softer spectrum. Psychologically, warm tones evoke feelings of calm, comfort, and premium craftsmanship. It mimics high-quality paper, book pages, and tangible objects.</p>
      
      <blockquote>
        "Creamy design feels less like a sterile spreadsheet and more like an inviting coffee shop workspace."
      </blockquote>

      <h3>2. Essential Creamy CSS Variables</h3>
      <p>To implement this in your project, establish a structured color scale. Here is the palette we've designed for this site:</p>
      
      <pre><code>:root {
  --bg-cream: #FAF6F0;      /* Primary body background */
  --bg-card: #FFFFFF;       /* Card and sidebar background */
  --accent-warm: #EFE9DF;   /* Light dividers and border accents */
  --text-charcoal: #2C2A27; /* Soft readable text */
  --accent-gold: #8E7C68;   /* Buttons, active states, highlights */
}</code></pre>

      <h3>3. Crafting the Soft Shadows</h3>
      <p>In a creamy theme, black shadows (#000000) look dirty and out of place. Instead, shadows should be tinted with warm hues. Using a transparent brown or warm grey tint produces a natural shadow that blends perfectly with cream background surfaces:</p>
      
      <pre><code>box-shadow: 0 10px 30px rgba(142, 124, 104, 0.08);</code></pre>

      <p>By blending these subtle design factors—organic colors, warm-tinted shadows, and premium typography like <strong>Outfit</strong> or <strong>Segoe UI</strong>—we create websites that look elegant and feel incredibly comfortable to read for hours.</p>
    `
  },
  {
    id: "blog-tailwind-vs-vanilla",
    title: "Why I Switched from Tailwind Back to Vanilla CSS",
    description: "An honest look at why I returned to writing raw, native CSS. Exploring modern features like CSS Nesting, Grid, Custom Properties, and why vanilla styles offer unmatched design flexibility.",
    category: "Coding",
    date: "May 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>Tailwind CSS is an absolute powerhouse. It has dominated web development for several years, offering speed and consistency. But in 2026, as native CSS capabilities have matured significantly, I found myself asking: <em>Do I still need a utility framework?</em></p>
      
      <p>Here is my journey of moving away from long class lists and returning to raw, beautiful Vanilla CSS.</p>
      
      <h3>1. Native CSS Nesting has Arrived</h3>
      <p>One of the primary benefits of Sass or Tailwind was nesting styles easily. Today, nesting is fully supported in native CSS across all modern browsers. We can write clean structures directly:</p>
      
      <pre><code>.dashboard-card {
  background: var(--bg-card);
  padding: 24px;
  
  .card-title {
    font-size: 1.25rem;
    color: var(--text-main);
  }
  
  &:hover {
    transform: translateY(-4px);
  }
}</code></pre>

      <h3>2. The Clutter of HTML Class Lists</h3>
      <p>Tailwind elements often end up looking like this:</p>
      <pre><code>&lt;div class="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-xl shadow-md space-y-4 md:space-y-0 hover:shadow-lg transition-all duration-300"&gt;...&lt;/div&gt;</code></pre>
      <p>While readable once you learn it, it creates massive HTML files and separates structure from design. Vanilla CSS allows you to group styles semantically, making your components cleaner and easier to manage in vanilla static pages.</p>

      <h3>3. CSS Grid & Custom Properties</h3>
      <p>With native CSS custom variables, we can make websites fully themeable and dynamic. We can swap themes by simply toggling a class on the `<body>` element. We can create advanced, flexible layouts using CSS Grid and subgrids without writing complex utility code.</p>

      <h3>Conclusion</h3>
      <p>For fast prototyping in large teams, Tailwind is fantastic. But for custom, premium, and highly animated websites like dashboards or portfolios, writing native CSS gives you full creative freedom and keeps your code closer to the browser.</p>
    `
  },
  {
    id: "blog-slow-living",
    title: "Embracing Slow Living in a Fast-Paced Tech World",
    description: "In an industry obsessed with productivity and optimization, how do we find stillness? Exploring mindfulness, setting offline boundaries, and cultivating analog hobbies.",
    category: "Lifestyle",
    date: "May 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>As developers, designers, and creators, our lives are dictated by speeds: load speeds, build times, sprint deadlines, and the endless scroll of social feeds. We optimize our IDEs, our keyboards, and our daily schedules. But when does optimization become exhausting?</p>
      
      <p>Recently, I've been practicing the philosophy of <strong>slow living</strong>—a conscious choice to decelerate and find stillness in a highly connected world. Here are a few ways I've integrated these ideas into my daily routine:</p>
      
      <h3>1. The First Hour Rule</h3>
      <p>I started a rule: no screens for the first hour of the morning. No emails, no GitHub notifications, no social media. Instead, I make coffee manually, sit by the window, and read a physical book or journal. This small shift prevents my brain from starting the day in a reactive state, reducing stress and boosting focus.</p>

      <h3>2. Analog Hobbies</h3>
      <p>If your job and hobbies both involve looking at a screen, your brain never truly rests. Cultivating analog hobbies—such as woodworking, sketching, gardening, or physical cooking—helps establish a clean mental break. It uses different motor skills and allows you to enjoy the process without needing a "publish" or "save" button.</p>

      <blockquote>
        "The creative mind needs boredom and silence to connect the dots. A brain that is constantly fed information will struggle to generate original ideas."
      </blockquote>

      <h3>3. Setting Digital Boundaries</h3>
      <p>We don't need to be accessible 24/7. Turn off non-essential notifications, set a strict wrap-up time for work, and let your team know you check communications in blocks rather than real-time. Designing your boundaries is the ultimate form of self-respect in the digital age.</p>

      <p>Decelerating is not about doing less; it's about being more present in what you choose to do. Give your mind a break, and watch your creative output thrive.</p>
    `
  }
];
