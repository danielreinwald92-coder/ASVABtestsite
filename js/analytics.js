// Vercel Web Analytics initialization
// This script initializes the Vercel Web Analytics tracking

window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

// Optional: Configure beforeSend hook to filter events if needed
// window.va('beforeSend', (event) => {
//   // Example: Don't track private pages
//   // if (event.url.includes('/private')) {
//   //   return null;
//   // }
//   return event;
// });
