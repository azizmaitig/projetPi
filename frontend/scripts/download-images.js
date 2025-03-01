const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = {
  'parking-hero.jpg': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200',
  'search-step.jpg': 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=800',
  'book-step.jpg': 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800',
  'park-step.jpg': 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800',
  'parking-space-1.jpg': 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
  'parking-space-2.jpg': 'https://images.unsplash.com/photo-1611408447388-09a0b0d2b70e?w=800',
  'parking-space-3.jpg': 'https://images.unsplash.com/photo-1587955415504-2ccaa59d0ae7?w=800'
};

const downloadImage = (url, filename) => {
  const targetPath = path.join(__dirname, '../public/images', filename);
  
  if (!fs.existsSync(path.dirname(targetPath))) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  }

  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(targetPath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded: ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
};

console.log('Starting image downloads...');
Object.entries(imageUrls).forEach(([filename, url]) => {
  downloadImage(url, filename);
}); 