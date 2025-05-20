/**
* Template Name: NiceAdmin
* Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
* Updated: Apr 7 2025 with Bootstrap v5.3.5
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";
  
  // Safe query selector - returns null instead of throwing errors
  const select = (el, all = false) => {
    try {
      if (!el || typeof el !== 'string') {
        console.warn('Invalid selector provided:', el);
        return all ? [] : null;
      }
      
      el = el.trim();
      if (!el) {
        console.warn('Empty selector provided');
        return all ? [] : null;
      }
      
      if (all) {
        const elements = document.querySelectorAll(el);
        return elements ? Array.from(elements) : [];
      } else {
        return document.querySelector(el);
      }
    } catch (e) {
      console.warn('Error selecting element:', el, e);
      return all ? [] : null;
    }
  };

  // Safe event listener function
  const on = (type, el, listener, all = false) => {
    try {
      if (!el) {
        console.warn('No selector provided for event listener');
        return;
      }
      let selectEl = select(el, all);
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener));
        } else {
          selectEl.addEventListener(type, listener);
        }
      }
    } catch (error) {
      console.error('Error adding event listener:', error);
    }
  };

  // Safe scroll event listener 
  const onscroll = (el, listener) => {
    try {
      if (!listener || typeof listener !== 'function') {
        console.warn('Invalid scroll listener provided');
        return;
      }
      
      if (el && typeof el.addEventListener === 'function') {
        el.addEventListener('scroll', listener);
      } else if (el) {
        console.warn('Invalid element provided for scroll listener, using window instead');
        window.addEventListener('scroll', listener);
      } else {
        window.addEventListener('scroll', listener);
      }
    } catch (e) {
      console.warn('Error in onscroll:', e);
    }
  };

  // Initialize the dashboard
  function initializeDashboard() {
    // Sidebar toggle
    try {
      if (select('.toggle-sidebar-btn')) {
        on('click', '.toggle-sidebar-btn', function(e) {
          const body = select('body');
          if (body) body.classList.toggle('toggle-sidebar');
        });
      }
    } catch (e) {
      console.warn('Error in sidebar toggle:', e);
    }

    // Search bar toggle
    try {
      if (select('.search-bar-toggle')) {
        on('click', '.search-bar-toggle', function(e) {
          const searchBar = select('.search-bar');
          if (searchBar) searchBar.classList.toggle('search-bar-show');
        });
      }
    } catch (e) {
      console.warn('Error in search bar toggle:', e);
    }

    // Navbar links active state on scroll
    try {
      let navbarlinks = select('#navbar .scrollto', true);
      if (navbarlinks && navbarlinks.length > 0) {
        const navbarlinksActive = () => {
          let position = window.scrollY + 200;
          navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return;
            let section = select(navbarlink.hash);
            if (!section) return;
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
              navbarlink.classList.add('active');
            } else {
              navbarlink.classList.remove('active');
            }
          });
        };
        window.addEventListener('load', navbarlinksActive);
        onscroll(document, navbarlinksActive);
      }
    } catch (e) {
      console.warn('Error in navbar links:', e);
    }

    // Toggle .header-scrolled class to #header when page is scrolled
    try {
      const headerElement = select('#header');
      if (headerElement && headerElement.nodeType === Node.ELEMENT_NODE) {
        const headerScrolled = () => {
          try {
            if (!headerElement || !headerElement.classList) return;
            const shouldScroll = window.scrollY > 100;
            if (shouldScroll) {
              headerElement.classList.add('header-scrolled');
            } else {
              headerElement.classList.remove('header-scrolled');
            }
          } catch (e) {
            console.warn('Error in header scroll handler:', e);
          }
        };
        
        // Run once on load
        headerScrolled();
        
        // Then add scroll listener
        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', headerScrolled, { passive: true });
        }
      } else {
        console.warn('Header element (#header) not found or invalid in the DOM');
      }
    } catch (e) {
      console.warn('Error initializing header scroll:', e);
    }

    // Back to top button
    try {
      let backtotop = select('.back-to-top');
      if (backtotop) {
        const toggleBacktotop = () => {
          if (window.scrollY > 100) {
            backtotop.classList.add('active');
          } else {
            backtotop.classList.remove('active');
          }
        };
        window.addEventListener('load', toggleBacktotop);
        onscroll(document, toggleBacktotop);
      }
    } catch (e) {
      console.warn('Error in back to top button:', e);
    }

    // Initiate tooltips
    try {
      if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if (tooltipTriggerList && tooltipTriggerList.length > 0) {
          const tooltipList = [].slice.call(tooltipTriggerList).map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
          });
        }
      }
    } catch (e) {
      console.warn('Error initializing tooltips:', e);
    }

    // Initiate quill editors
    try {
      if (typeof Quill !== 'undefined') {
        if (select('.quill-editor-default')) {
          new Quill('.quill-editor-default', {
            theme: 'snow'
          });
        }

        if (select('.quill-editor-bubble')) {
          new Quill('.quill-editor-bubble', {
            theme: 'bubble'
          });
        }

        if (select('.quill-editor-full')) {
          new Quill(".quill-editor-full", {
            modules: {
              toolbar: [
                [{
                  font: []
                }, {
                  size: []
                }],
                ["bold", "italic", "underline", "strike"],
                [{
                    color: []
                  },
                  {
                    background: []
                  }
                ],
                [{
                    script: "super"
                  },
                  {
                    script: "sub"
                  }
                ],
                [{
                    list: "ordered"
                  },
                  {
                    list: "bullet"
                  },
                  {
                    indent: "-1"
                  },
                  {
                    indent: "+1"
                  }
                ],
                ["direction", {
                  align: []
                }],
                ["link", "image", "video"],
                ["clean"]
              ]
            },
            theme: "snow"
          });
        }
      }
    } catch (e) {
      console.warn('Error initializing Quill editors:', e);
    }

    // Initiate TinyMCE Editor
    try {
      if (typeof tinymce !== 'undefined') {
        const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;

        if (document.querySelector('textarea.tinymce-editor')) {
          tinymce.init({
            selector: '#editor',
            plugins: 'code',
            toolbar: 'code'
          });
        }
      }
    } catch (e) {
      console.warn('Error initializing TinyMCE editor:', e);
    }
  }

  // Initialize the dashboard when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      try {
        initializeDashboard();
      } catch (e) {
        console.error('Error initializing dashboard:', e);
      }
    });
  } else {
    // DOMContentLoaded has already fired
    setTimeout(function() {
      try {
        initializeDashboard();
      } catch (e) {
        console.error('Error initializing dashboard:', e);
      }
    }, 0);
  }
})();
