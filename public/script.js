 

document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.swiper-slide');
    let currentSlide = 0;
  
    setInterval(() => {
      slides.forEach(slide => slide.style.display = 'none');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = 'block';
    }, 3000);
  });
  
  

 
  const searchIcon = document.getElementById('search-icon');
  const searchBox = document.getElementById('search-box');
  
  // When you click the search icon, show the search box
  searchIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop click from bubbling to document
    searchBox.style.display = 'block';
  });
  
  // Clicking inside the search box should not close it
  searchBox.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // If you click anywhere else on the page, hide the search box
  document.addEventListener('click', () => {
    searchBox.style.display = 'none';
  });



