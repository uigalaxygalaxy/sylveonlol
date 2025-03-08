// Open the popup
document.getElementById('openPopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'flex';
  });
  
  // Close the popup
  document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });
  
  // Change CSS root variable
  document.querySelectorAll('.change-color').forEach(button => {
    button.addEventListener('click', () => {
      const color = button.getAttribute('data-color');
      const color2 = button.getAttribute('data-color2');
      document.documentElement.style.setProperty('--CC', color);
      document.documentElement.style.setProperty('--C2', color2);

    });
  });