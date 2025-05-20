import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to load and manage dashboard scripts
 */
export const useDashboardScripts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scriptsLoaded = useRef(new Set());

  // Function to load a single script
  const loadScript = (src, isModule = false) => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (scriptsLoaded.current.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      if (isModule) {
        script.type = 'module';
      }

      script.onload = () => {
        scriptsLoaded.current.add(src);
        console.log(`Script loaded: ${src}`);
        resolve();
      };

      script.onerror = () => {
        const error = new Error(`Failed to load script: ${src}`);
        console.error(error);
        setError(error);
        reject(error);
      };

      document.body.appendChild(script);
    });
  };

  // Load all required scripts
  const loadDashboardScripts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load vendor scripts
      await Promise.all([
        loadScript('/assets/dashboard/vendor/apexcharts/apexcharts.min.js'),
        loadScript('/assets/dashboard/vendor/bootstrap/js/bootstrap.bundle.min.js'),
        loadScript('/assets/dashboard/vendor/chart.js/chart.umd.js'),
        loadScript('/assets/dashboard/vendor/echarts/echarts.min.js'),
        loadScript('/assets/dashboard/vendor/quill/quill.min.js'),
        loadScript('/assets/dashboard/vendor/simple-datatables/simple-datatables.js'),
        loadScript('/assets/dashboard/vendor/tinymce/tinymce.min.js'),
        loadScript('/assets/dashboard/vendor/php-email-form/validate.js'),
      ]);

      // Load main.js last
      await loadScript('/assets/dashboard/js/main.js');
      
      // Check if the template's initialization function exists
      if (typeof window.initializeTemplate === 'function') {
        window.initializeTemplate();
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error loading dashboard scripts:', err);
      setError(err);
      setIsLoading(false);
    }
  };

  // Cleanup function to remove scripts when component unmounts
  const cleanupScripts = () => {
    scriptsLoaded.current.forEach(src => {
      const script = document.querySelector(`script[src="${src}"]`);
      if (script) {
        script.remove();
        scriptsLoaded.current.delete(src);
      }
    });
  };

  return {
    loadDashboardScripts,
    cleanupScripts,
    isLoading,
    error
  };
};

export default useDashboardScripts;
