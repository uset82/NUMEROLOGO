const { exec } = require('child_process');
const path = require('path');

console.log('🔮 Opening Preview in Cursor...');

// Open the preview file in Cursor
exec(`cursor "${path.join(__dirname, 'preview.html')}"`, (error) => {
  if (error) {
    console.log('❌ Could not open preview automatically');
    console.log('📋 Please manually open preview.html and use Live Preview');
  } else {
    console.log('✅ Preview opened in Cursor!');
  }
}); 