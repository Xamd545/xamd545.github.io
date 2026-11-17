(() => {
  const loadMathjax = () => {
    const article = document.getElementById('article-container');
    if (!article || article.querySelector('.hbe-container') || !article.textContent.includes('$')) return;

    const typeset = () => {
      window.MathJax.startup.promise
        .then(() => window.MathJax.typesetPromise([article]))
        .catch(error => console.error('MathJax 公式渲染失败：', error));
    };

    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetClear();
      window.MathJax.typesetPromise([article]).catch(error => console.error('MathJax 公式渲染失败：', error));
      return;
    }

    const existingScript = document.getElementById('MathJax-script');
    if (existingScript) {
      existingScript.addEventListener('load', typeset, { once: true });
      return;
    }

    window.MathJax = {
      startup: {
        typeset: false
      },
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        enableMenu: true
      },
      chtml: {
        scale: 1.1
      }
    };

    const script = document.createElement('script');
    script.id = 'MathJax-script';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js';
    script.async = true;
    script.onload = typeset;
    script.onerror = () => console.error('MathJax 脚本加载失败，请检查网络或 CDN 连接。');
    document.head.appendChild(script);
  };

  if (window.pjax) loadMathjax();
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadMathjax);
  else loadMathjax();
})();
