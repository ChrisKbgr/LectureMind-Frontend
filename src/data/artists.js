// Centralized artist data: artPeriods and artistDatabase
// Each artist has: name, birth, death, period, keyword, portrait, bio, famousWorks, worksImages (array of 3 URLs)

export const artPeriods = {
  renaissance: {
    name: 'Renaissance',
    artists: [
      { name: 'Leonardo da Vinci', birth: 1452, death: 1519, period: 'Renaissance', keyword: 'leonardo' },
      { name: 'Michelangelo', birth: 1475, death: 1564, period: 'Renaissance', keyword: 'michelangelo' },
      { name: 'Raphael', birth: 1483, death: 1520, period: 'Renaissance', keyword: 'raphael' },
      { name: 'Donatello', birth: 1386, death: 1466, period: 'Early Renaissance', keyword: 'donatello' },
      { name: 'Sandro Botticelli', birth: 1445, death: 1510, period: 'Renaissance', keyword: 'botticelli' },
      { name: 'Titian', birth: 1488, death: 1576, period: 'Renaissance', keyword: 'titian' },
      { name: 'Caravaggio', birth: 1571, death: 1610, period: 'Baroque', keyword: 'caravaggio' }
    ]
  },
  baroque: {
    name: 'Baroque',
    artists: [
      { name: 'Rembrandt', birth: 1606, death: 1669, period: 'Baroque', keyword: 'rembrandt' },
      { name: 'Vermeer', birth: 1632, death: 1675, period: 'Baroque', keyword: 'vermeer' },
      { name: 'Rubens', birth: 1577, death: 1640, period: 'Baroque', keyword: 'rubens' },
      { name: 'Velazquez', birth: 1599, death: 1660, period: 'Baroque', keyword: 'velazquez' },
      { name: 'Bernini', birth: 1598, death: 1680, period: 'Baroque', keyword: 'bernini' }
    ]
  },
  impressionism: {
    name: 'Impressionism',
    artists: [
      { name: 'Claude Monet', birth: 1840, death: 1926, period: 'Impressionism', keyword: 'monet' },
      { name: 'Pierre-Auguste Renoir', birth: 1841, death: 1919, period: 'Impressionism', keyword: 'renoir' },
      { name: 'Edgar Degas', birth: 1834, death: 1917, period: 'Impressionism', keyword: 'degas' },
      { name: 'Edouard Manet', birth: 1832, death: 1883, period: 'Impressionism', keyword: 'manet' },
      { name: 'Camille Pissarro', birth: 1830, death: 1903, period: 'Impressionism', keyword: 'pissarro' }
    ]
  },
  modern: {
    name: 'Modern Art',
    artists: [
      { name: 'Pablo Picasso', birth: 1881, death: 1973, period: 'Modern', keyword: 'picasso' },
      { name: 'Vincent van Gogh', birth: 1853, death: 1890, period: 'Post-Impressionism', keyword: 'vangogh' },
      { name: 'Henri Matisse', birth: 1869, death: 1954, period: 'Modern', keyword: 'matisse' },
      { name: 'Salvador Dali', birth: 1904, death: 1989, period: 'Surrealism', keyword: 'dali' },
      { name: 'Andy Warhol', birth: 1928, death: 1987, period: 'Pop Art', keyword: 'warhol' }
    ]
  }
};

// Attempt to load generated manifest (created by npm run generate-artist-manifest)
let artistManifest = {};
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  artistManifest = require('./artist-manifest.json');
} catch (err) {
  // manifest may not exist during development; that's ok
  artistManifest = {};
}

export const artistDatabase = {
  leonardo: {
    name: 'Leonardo da Vinci',
    birth: 1452,
    death: 1519,
    period: 'Renaissance',
    // local images under public/artists/leonardo/
  portrait: (artistManifest.leonardo && artistManifest.leonardo.portrait) || '/artists/leonardo/portrait/portrait.jpg',
    bio: 'Italian polymath of the Renaissance. Known for the Mona Lisa and The Last Supper.',
    famousWorks: ['Mona Lisa', 'The Last Supper', 'Vitruvian Man'],
    worksImages: (artistManifest.leonardo && artistManifest.leonardo.worksImages) || [
      '/artists/leonardo/works/mona_lisa.jpg',
      '/artists/leonardo/works/last_supper.jpg',
      '/artists/leonardo/works/vitruvian_man.jpg'
    ]
  },
  michelangelo: {
    name: 'Michelangelo',
    birth: 1475,
    death: 1564,
    period: 'Renaissance',
  portrait: (artistManifest.michelangelo && artistManifest.michelangelo.portrait) || '/artists/michelangelo/portrait/portrait.jpg',
    bio: 'Italian sculptor, painter, architect, and poet. Created the Sistine Chapel ceiling.',
    famousWorks: ['David', 'Sistine Chapel', 'Pieta'],
    worksImages: (artistManifest.michelangelo && artistManifest.michelangelo.worksImages) || [
      '/artists/michelangelo/works/david.jpg',
      '/artists/michelangelo/works/creation_of_adam.jpg',
      '/artists/michelangelo/works/pieta.jpg'
    ]
  },
  raphael: {
    name: 'Raphael',
    birth: 1483,
    death: 1520,
    period: 'Renaissance',
  portrait: (artistManifest.raphael && artistManifest.raphael.portrait) || '/artists/raphael/portrait/portrait.jpg',
    bio: 'Italian painter and architect. Known for his clarity of form and ease of composition.',
    famousWorks: ['The School of Athens', 'Sistine Madonna', 'Transfiguration'],
    worksImages: (artistManifest.raphael && artistManifest.raphael.worksImages) || [
      '/artists/raphael/works/work1.jpg',
      '/artists/raphael/works/work2.jpg',
      '/artists/raphael/works/work3.jpg'
    ]
  },
  donatello: {
    name: 'Donatello',
    birth: 1386,
    death: 1466,
    period: 'Early Renaissance',
  portrait: (artistManifest.donatello && artistManifest.donatello.portrait) || '/artists/donatello/portrait/portrait.jpg',
    bio: 'Italian sculptor of the Renaissance. Pioneer of perspective in sculpture.',
    famousWorks: ['David', 'Gattamelata', 'St. George'],
    worksImages: (artistManifest.donatello && artistManifest.donatello.worksImages) || [
      '/artists/donatello/works/work1.jpg',
      '/artists/donatello/works/work2.jpg',
      '/artists/donatello/works/work3.jpg'
    ]
  },
  botticelli: {
    name: 'Sandro Botticelli',
    birth: 1445,
    death: 1510,
    period: 'Renaissance',
  portrait: (artistManifest.botticelli && artistManifest.botticelli.portrait) || '/artists/botticelli/portrait/portrait.jpg',
    bio: 'Italian painter of the Early Renaissance. Known for mythological and religious subjects.',
    famousWorks: ['The Birth of Venus', 'Primavera', 'Adoration of the Magi'],
    worksImages: (artistManifest.botticelli && artistManifest.botticelli.worksImages) || [
      '/artists/botticelli/works/work1.jpg',
      '/artists/botticelli/works/work2.jpg',
      '/artists/botticelli/works/work3.jpg'
    ]
  },
  titian: {
    name: 'Titian',
    birth: 1488,
    death: 1576,
    period: 'Renaissance',
  portrait: (artistManifest.titian && artistManifest.titian.portrait) || '/artists/titian/portrait/portrait.jpg',
    bio: 'Italian painter of the Venetian school. Master of color and composition.',
    famousWorks: ['Venus of Urbino', 'Assumption of the Virgin', 'Bacchus and Ariadne'],
    worksImages: (artistManifest.titian && artistManifest.titian.worksImages) || [
      '/artists/titian/works/work1.jpg',
      '/artists/titian/works/work2.jpg',
      '/artists/titian/works/work3.jpg'
    ]
  },
  caravaggio: {
    name: 'Caravaggio',
    birth: 1571,
    death: 1610,
    period: 'Baroque',
  portrait: (artistManifest.caravaggio && artistManifest.caravaggio.portrait) || '/artists/caravaggio/portrait/portrait.jpg',
    bio: 'Italian painter known for dramatic use of light and shadow (chiaroscuro).',
    famousWorks: ['The Calling of St Matthew', 'Judith Beheading Holofernes', 'The Supper at Emmaus'],
    worksImages: (artistManifest.caravaggio && artistManifest.caravaggio.worksImages) || [
      '/artists/caravaggio/works/work1.jpg',
      '/artists/caravaggio/works/work2.jpg',
      '/artists/caravaggio/works/work3.jpg'
    ]
  },
  rembrandt: {
    name: 'Rembrandt',
    birth: 1606,
    death: 1669,
    period: 'Baroque',
  portrait: (artistManifest.rembrandt && artistManifest.rembrandt.portrait) || '/artists/rembrandt/portrait/portrait.jpg',
    bio: 'Dutch painter and etcher. Master of light and shadow in portraiture.',
    famousWorks: ['The Night Watch', 'Self-Portrait', 'The Jewish Bride'],
    worksImages: (artistManifest.rembrandt && artistManifest.rembrandt.worksImages) || [
      '/artists/rembrandt/works/work1.jpg',
      '/artists/rembrandt/works/work2.jpg',
      '/artists/rembrandt/works/work3.jpg'
    ]
  },
  vermeer: {
    name: 'Johannes Vermeer',
    birth: 1632,
    death: 1675,
    period: 'Baroque',
  portrait: (artistManifest.vermeer && artistManifest.vermeer.portrait) || '/artists/vermeer/portrait/portrait.jpg',
    bio: 'Dutch painter known for domestic interior scenes and masterful use of light.',
    famousWorks: ['Girl with a Pearl Earring', 'The Milkmaid', 'View of Delft'],
    worksImages: (artistManifest.vermeer && artistManifest.vermeer.worksImages) || [
      '/artists/vermeer/works/work1.jpg',
      '/artists/vermeer/works/work2.jpg',
      '/artists/vermeer/works/work3.jpg'
    ]
  },
  rubens: {
    name: 'Peter Paul Rubens',
    birth: 1577,
    death: 1640,
    period: 'Baroque',
  portrait: (artistManifest.rubens && artistManifest.rubens.portrait) || '/artists/rubens/portrait/portrait.jpg',
    bio: 'Flemish Baroque painter known for vibrant, dynamic compositions.',
    famousWorks: ['The Descent from the Cross', 'The Garden of Love', 'The Massacre of the Innocents'],
    worksImages: (artistManifest.rubens && artistManifest.rubens.worksImages) || [
      '/artists/rubens/works/work1.jpg',
      '/artists/rubens/works/work2.jpg',
      '/artists/rubens/works/work3.jpg'
    ]
  },
  velazquez: {
    name: 'Diego Velázquez',
    birth: 1599,
    death: 1660,
    period: 'Baroque',
  portrait: (artistManifest.velazquez && artistManifest.velazquez.portrait) || '/artists/velazquez/portrait/portrait.jpg',
    bio: 'Spanish painter of the Golden Age, court painter to King Philip IV.',
    famousWorks: ['Las Meninas', 'The Surrender of Breda', 'Old Woman Frying Eggs'],
    worksImages: (artistManifest.velazquez && artistManifest.velazquez.worksImages) || [
      '/artists/velazquez/works/work1.jpg',
      '/artists/velazquez/works/work2.jpg',
      '/artists/velazquez/works/work3.jpg'
    ]
  },
  bernini: {
    name: 'Gian Lorenzo Bernini',
    birth: 1598,
    death: 1680,
    period: 'Baroque',
  portrait: (artistManifest.bernini && artistManifest.bernini.portrait) || '/artists/bernini/portrait/portrait.jpg',
    bio: 'Italian sculptor and architect who shaped Roman Baroque.',
    famousWorks: ['Ecstasy of Saint Teresa', 'Fountain of the Four Rivers', 'Apollo and Daphne'],
    worksImages: (artistManifest.bernini && artistManifest.bernini.worksImages) || [
      '/artists/bernini/works/work1.jpg',
      '/artists/bernini/works/work2.jpg',
      '/artists/bernini/works/work3.jpg'
    ]
  },
  monet: {
    name: 'Claude Monet',
    birth: 1840,
    death: 1926,
    period: 'Impressionism',
  portrait: (artistManifest.monet && artistManifest.monet.portrait) || '/artists/monet/portrait/portrait.jpg',
    bio: 'French painter and founder of Impressionism. Master of capturing light and atmosphere.',
    famousWorks: ['Water Lilies', 'Impression, Sunrise', 'Haystacks'],
    worksImages: (artistManifest.monet && artistManifest.monet.worksImages) || [
      '/artists/monet/works/work1.jpg',
      '/artists/monet/works/work2.jpg',
      '/artists/monet/works/work3.jpg'
    ]
  },
  renoir: {
    name: 'Pierre-Auguste Renoir',
    birth: 1841,
    death: 1919,
    period: 'Impressionism',
  portrait: (artistManifest.renoir && artistManifest.renoir.portrait) || '/artists/renoir/portrait/portrait.jpg',
    bio: 'French artist who celebrated beauty, particularly feminine sensuality.',
    famousWorks: ['Dance at Le Moulin de la Galette', 'Luncheon of the Boating Party', 'The Swing'],
    worksImages: (artistManifest.renoir && artistManifest.renoir.worksImages) || [
      '/artists/renoir/works/work1.jpg',
      '/artists/renoir/works/work2.jpg',
      '/artists/renoir/works/work3.jpg'
    ]
  },
  degas: {
    name: 'Edgar Degas',
    birth: 1834,
    death: 1917,
    period: 'Impressionism',
  portrait: (artistManifest.degas && artistManifest.degas.portrait) || '/artists/degas/portrait/portrait.jpg',
    bio: 'Known for his paintings of dancers, and innovative compositions.',
    famousWorks: ['The Ballet Class', 'The Absinthe Drinker', 'Little Dancer Aged Fourteen'],
    worksImages: (artistManifest.degas && artistManifest.degas.worksImages) || [
      '/artists/degas/works/work1.jpg',
      '/artists/degas/works/work2.jpg',
      '/artists/degas/works/work3.jpg'
    ]
  },
  manet: {
    name: 'Edouard Manet',
    birth: 1832,
    death: 1883,
    period: 'Impressionism',
  portrait: (artistManifest.manet && artistManifest.manet.portrait) || '/artists/manet/portrait/portrait.jpg',
    bio: 'Pivotal figure in the transition from Realism to Impressionism.',
    famousWorks: ['Olympia', 'Le Déjeuner sur l\'herbe', 'A Bar at the Folies-Bergère'],
    worksImages: (artistManifest.manet && artistManifest.manet.worksImages) || [
      '/artists/manet/works/work1.jpg',
      '/artists/manet/works/work2.jpg',
      '/artists/manet/works/work3.jpg'
    ]
  },
  pissarro: {
    name: 'Camille Pissarro',
    birth: 1830,
    death: 1903,
    period: 'Impressionism',
  portrait: (artistManifest.pissarro && artistManifest.pissarro.portrait) || '/artists/pissarro/portrait/portrait.jpg',
    bio: 'Danish-French Impressionist and Neo-Impressionist painter.',
    famousWorks: ['The Boulevard Montmartre', 'The Harvest', 'Peasant Girl'],
    worksImages: (artistManifest.pissarro && artistManifest.pissarro.worksImages) || [
      '/artists/pissarro/works/work1.jpg',
      '/artists/pissarro/works/work2.jpg',
      '/artists/pissarro/works/work3.jpg'
    ]
  },
  picasso: {
    name: 'Pablo Picasso',
    birth: 1881,
    death: 1973,
    period: 'Modern',
  portrait: (artistManifest.picasso && artistManifest.picasso.portrait) || '/artists/picasso/portrait/portrait.jpg',
    bio: 'Spanish painter, sculptor, and co-founder of Cubism. Revolutionary modern artist.',
    famousWorks: ['Guernica', "Les Demoiselles d'Avignon", 'The Old Guitarist'],
    worksImages: (artistManifest.picasso && artistManifest.picasso.worksImages) || [
      '/artists/picasso/works/work1.jpg',
      '/artists/picasso/works/work2.jpg',
      '/artists/picasso/works/work3.jpg'
    ]
  },
  vangogh: {
    name: 'Vincent van Gogh',
    birth: 1853,
    death: 1890,
    period: 'Post-Impressionism',
  portrait: (artistManifest.vangogh && artistManifest.vangogh.portrait) || '/artists/vangogh/portrait/portrait.jpg',
    bio: 'Dutch post-impressionist painter. Known for bold colors and expressive brushwork.',
    famousWorks: ['Starry Night', 'Sunflowers', 'The Bedroom'],
    worksImages: (artistManifest.vangogh && artistManifest.vangogh.worksImages) || [
      '/artists/vangogh/works/work1.jpg',
      '/artists/vangogh/works/work2.jpg',
      '/artists/vangogh/works/work3.jpg'
    ]
  },
  matisse: {
    name: 'Henri Matisse',
    birth: 1869,
    death: 1954,
    period: 'Modern',
  portrait: (artistManifest.matisse && artistManifest.matisse.portrait) || '/artists/matisse/portrait/portrait.jpg',
    bio: 'French artist known for use of color and fluid draughtsmanship.',
    famousWorks: ['The Dance', 'Woman with a Hat', 'The Red Studio'],
    worksImages: (artistManifest.matisse && artistManifest.matisse.worksImages) || [
      '/artists/matisse/works/work1.jpg',
      '/artists/matisse/works/work2.jpg',
      '/artists/matisse/works/work3.jpg'
    ]
  },
  dali: {
    name: 'Salvador Dali',
    birth: 1904,
    death: 1989,
    period: 'Surrealism',
  portrait: (artistManifest.dali && artistManifest.dali.portrait) || '/artists/dali/portrait/portrait.jpg',
    bio: 'Spanish Surrealist painter known for dreamlike and bizarre images.',
    famousWorks: ['The Persistence of Memory', 'Swans Reflecting Elephants', 'The Elephants'],
    worksImages: (artistManifest.dali && artistManifest.dali.worksImages) || [
      '/artists/dali/works/work1.jpg',
      '/artists/dali/works/work2.jpg',
      '/artists/dali/works/work3.jpg'
    ]
  },
  warhol: {
    name: 'Andy Warhol',
    birth: 1928,
    death: 1987,
    period: 'Pop Art',
  portrait: (artistManifest.warhol && artistManifest.warhol.portrait) || '/artists/warhol/portrait/portrait.jpg',
    bio: 'Leading figure in the visual art movement known as pop art.',
    famousWorks: ['Campbell\'s Soup Cans', 'Marilyn Diptych', 'Eight Elvises'],
    worksImages: (artistManifest.warhol && artistManifest.warhol.worksImages) || [
      '/artists/warhol/works/work1.jpg',
      '/artists/warhol/works/work2.jpg',
      '/artists/warhol/works/work3.jpg'
    ]
  }
};
