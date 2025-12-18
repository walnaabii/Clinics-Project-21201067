/**
 * Header Navigation Module
 * Provides consistent navigation across all pages
 */

import { authAPI } from './api.js';

/**
 * Get the current page name for active link highlighting
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  // Check for hash-based navigation (index.html sections)
  if (hash) {
    return hash.substring(1); // Remove #
  }
  
  // Extract page name from path
  const page = path.split('/').pop() || 'index.html';
  const pageName = page.replace('.html', '');
  
  // Handle special page names
  if (pageName === 'Booking Appointments' || pageName === 'Booking%20Appointments') {
    return 'Booking Appointments';
  }
  
  return pageName;
}

/**
 * Build navigation items based on user role and current page
 */
function buildNavItems(currentPage) {
  const user = authAPI.getCurrentUserFromStorage();
  const isLoggedIn = user && authAPI.isLoggedIn();
  
  let navItems = '';
  
  // Common navigation items
  const homeLink = currentPage === 'hero' || currentPage === 'index' 
    ? '<li><a href="#hero" class="active">Home</a></li>'
    : '<li><a href="index.html#hero">Home</a></li>';
  
  const aboutLink = currentPage === 'about'
    ? '<li><a href="#about" class="active">About</a></li>'
    : '<li><a href="index.html#about">About</a></li>';
  
  const clinicsLink = currentPage === 'services'
    ? '<li><a href="#services" class="active">All clinics</a></li>'
    : '<li><a href="index.html#services">All clinics</a></li>';
  
  const bookingLink = currentPage === 'Booking Appointments'
    ? '<li><a href="Booking Appointments.html" class="active">Booking Appointments</a></li>'
    : '<li><a href="Booking Appointments.html">Booking Appointments</a></li>';
  
  const contactLink = currentPage === 'contact'
    ? '<li><a href="contact.html" class="active">Contact</a></li>'
    : '<li><a href="contact.html">Contact</a></li>';
  
  navItems += homeLink;
  navItems += aboutLink;
  navItems += clinicsLink;
  navItems += bookingLink;
  navItems += contactLink;
  
  // Role-based navigation items
  if (isLoggedIn) {
    // Admin Panel (only for admin role)
    if (user.role === 'admin') {
      const adminLink = currentPage === 'admin'
        ? '<li><a href="admin.html" class="active fw-bold"><i class="fa-solid fa-gauge-high me-1"></i>Admin Panel</a></li>'
        : '<li><a href="admin.html" class="fw-bold"><i class="fa-solid fa-gauge-high me-1"></i>Admin Panel</a></li>';
      navItems += adminLink;
    }
    
    // Clinic Dashboard (only for clinic role)
    if (user.role === 'clinic') {
      const clinicLink = currentPage === 'clinic-dashboard'
        ? '<li><a href="clinic-dashboard.html" class="active"><i class="bi bi-hospital me-1"></i>Clinic Dashboard</a></li>'
        : '<li><a href="clinic-dashboard.html"><i class="bi bi-hospital me-1"></i>Clinic Dashboard</a></li>';
      navItems += clinicLink;
    }
    
    // Calendar
    const calendarLink = currentPage === 'calendar'
      ? '<li><a href="calendar.html" class="active"><i class="bi bi-calendar3 me-1"></i>Calendar</a></li>'
      : '<li><a href="calendar.html"><i class="bi bi-calendar3 me-1"></i>Calendar</a></li>';
    navItems += calendarLink;
    
    // My Profile
    const profileLink = currentPage === 'profile'
      ? '<li><a href="profile.html" class="active"><i class="bi bi-person me-1"></i>My Profile</a></li>'
      : '<li><a href="profile.html"><i class="bi bi-person me-1"></i>My Profile</a></li>';
    navItems += profileLink;
    
    // Welcome message and Logout
    navItems += `<li><a href="#" class="disabled fw-bold">Welcome, ${user.name}</a></li>`;
    navItems += '<li><a href="#" id="logout-link" class="text-danger">Logout</a></li>';
  } else {
    // Login and Register (for non-logged-in users)
    const loginLink = currentPage === 'login'
      ? '<li><a href="login.html" class="active">Login</a></li>'
      : '<li><a href="login.html">Login</a></li>';
    navItems += loginLink;
    
    navItems += '<li><a href="register.html" class="btn btn-primary text-white px-3 py-1 rounded-pill">Register</a></li>';
  }
  
  return navItems;
}

/**
 * Initialize header navigation
 * Call this function on page load
 */
export function initHeader() {
  const navItems = document.getElementById('nav-items');
  if (!navItems) {
    console.warn('Navigation container #nav-items not found');
    return;
  }
  
  const currentPage = getCurrentPage();
  const navHTML = buildNavItems(currentPage);
  
  // Clear existing items (except static ones if any)
  navItems.innerHTML = navHTML;
  
  // Setup logout handler
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      authAPI.logout();
      alert("Logged out successfully.");
      window.location.href = 'index.html';
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}

