const fs = require('fs');
const path = require('path');

function createEnvIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Erstellt: ${filePath}`);
  } else {
    console.log(`Übersprungen (existiert schon): ${filePath}`);
  }
}

// Frontend .env
createEnvIfNotExists(
  path.join(__dirname, 'PacmanFrontend/Frontend/.env'),
  'VITE_BASE_URL=http://localhost/\n'
);

// Backend .env
createEnvIfNotExists(
  path.join(__dirname, 'PacEnd/src/db/.env'),
  [
    'DB_HOST=localhost',
    'DB_PORT=5432',
    'DB_USER=adminPillenschlucker',
    'DB_PASSWORD=pille3000',
    'DB_NAME=vuedb'
  ].join('\n')
);

