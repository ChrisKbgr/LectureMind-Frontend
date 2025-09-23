const fs = require('fs');
const path = require('path');

const publicArtistsDir = path.join(__dirname, '..', 'public', 'artists');
const outFile = path.join(__dirname, '..', 'src', 'data', 'artist-manifest.json');

function scanArtists() {
  if (!fs.existsSync(publicArtistsDir)) {
    console.error('public/artists directory does not exist.');
    process.exit(1);
  }

  const artists = {};

  const keywords = fs.readdirSync(publicArtistsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  keywords.forEach(keyword => {
    const base = path.join(publicArtistsDir, keyword);
    const portraitDir = path.join(base, 'portrait');
    const worksDir = path.join(base, 'works');

    const portrait = fs.existsSync(portraitDir)
      ? fs.readdirSync(portraitDir).find(f => !f.startsWith('.'))
      : null;

    const works = fs.existsSync(worksDir)
      ? fs.readdirSync(worksDir).filter(f => !f.startsWith('.'))
      : [];

    artists[keyword] = {
      portrait: portrait ? `/artists/${keyword}/portrait/${portrait}` : null,
      worksImages: works.map(f => `/artists/${keyword}/works/${f}`)
    };
  });

  return artists;
}

function writeManifest(manifest) {
  const json = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(outFile, json, 'utf8');
  console.log(`Wrote artist manifest to ${outFile}`);
}

try {
  const manifest = scanArtists();
  writeManifest(manifest);
} catch (err) {
  console.error('Error generating artist manifest:', err);
  process.exit(1);
}
