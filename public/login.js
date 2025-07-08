const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const customerBtn = document.getElementById('customer-btn').addEventListener('click', function() {
  window.location.href = 'customerlogin.html';
}); 

const adminBtn = document.getElementById('admin-btn').addEventListener('click', function() {
  window.location.href = 'adminlogin.html';
});
const userTypeSelection = document.getElementById('user-type-selection');
const authForms = document.getElementById('auth-forms');

 
 

// Handle login/signup switching
loginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  loginBtn.classList.add('active');
  signupBtn.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  signupBtn.classList.add('active');
  loginBtn.classList.remove('active');
});
