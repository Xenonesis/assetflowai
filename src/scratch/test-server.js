const http = require('http');

const routes = ['/', '/login', '/signup', '/dashboard'];

function fetchRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      console.log(`\nRoute: ${route}`);
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Location Header:`, res.headers.location);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Response length: ${data.length} bytes`);
        if (res.statusCode >= 500) {
          console.error(`ERROR: Server error (500) on ${route}`);
          console.log(data.substring(0, 1000));
        } else if (data.includes('⨯') || data.includes('Internal Server Error')) {
          console.error(`ERROR: Potential crash or exception on ${route}`);
          console.log(data.substring(0, 1000));
        } else {
          console.log(`Route ${route} handled successfully.`);
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error connecting to http://localhost:3000${route}:`, err.message);
      resolve();
    });
  });
}

async function runTests() {
  for (const route of routes) {
    await fetchRoute(route);
  }
}

runTests();
