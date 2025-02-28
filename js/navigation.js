function navigateToPage(pageId) {
    document.querySelectorAll('.page').forEach((page) => {
      page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
  
    // Update active nav item
    document.querySelectorAll('nav ul li a').forEach((link) => {
      link.classList.remove('active');
    });
    document.querySelector(`a[href="../pages/${pageId}.html"]`).classList.add('active');
  }
  