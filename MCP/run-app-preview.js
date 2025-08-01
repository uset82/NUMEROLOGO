const { exec, spawn } = require('child_process');
const path = require('path');

console.log('🔮 Starting Numerology App in Preview Mode...');

// Start the development server
const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

console.log('📡 Starting development server...');

// Wait a few seconds for the server to start, then open preview
setTimeout(() => {
  console.log('🎯 Opening preview in Cursor...');
  
  // Open the preview file in Cursor
  exec(`cursor "${path.join(__dirname, 'preview.html')}"`, (error) => {
    if (error) {
      console.log('❌ Could not open preview automatically');
      console.log('📋 Please manually open preview.html and use Live Preview');
    } else {
      console.log('✅ Preview opened in Cursor!');
      console.log('🌐 App is running on http://localhost:3000');
    }
  });
}, 5000); // Wait 5 seconds for server to start

devServer.stdout.on('data', (data) => {
  console.log(`📡 ${data.toString().trim()}`);
});

devServer.stderr.on('data', (data) => {
  console.log(`⚠️  ${data.toString().trim()}`);
}); 