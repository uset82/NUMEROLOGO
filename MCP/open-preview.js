const { exec } = require('child_process');
const path = require('path');

// Get the current directory
const currentDir = __dirname;
const previewFile = path.join(currentDir, 'preview.html');

console.log('🔮 Opening Numerology App Preview in Cursor...');
console.log('📁 Preview file:', previewFile);

// Try to open the preview file in Cursor
exec(`cursor "${previewFile}"`, (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Could not open in Cursor automatically');
    console.log('📋 Please manually:');
    console.log('   1. Open preview.html in Cursor');
    console.log('   2. Right-click and select "Open Preview"');
    console.log('   3. Or press Ctrl+Shift+P and type "Live Preview"');
  } else {
    console.log('✅ Preview opened in Cursor!');
  }
});

// Also open the browser as backup
exec('start http://localhost:3000', (error) => {
  if (!error) {
    console.log('🌐 Also opened in browser as backup');
  }
}); 