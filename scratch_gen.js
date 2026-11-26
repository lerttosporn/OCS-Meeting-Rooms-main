const fs = require('fs');

const roomsData = [
  // 1) Classroom (30 cap)
  { ids: ['301'], cap: 30, half: 1950, full: 3500, types: ['classroom'] },
  { ids: ['403', '404', '405'], cap: 30, half: 5850, full: 11300, types: ['classroom', 'computer'] },
  { ids: ['501', '502', '503', '504', '505'], cap: 30, half: 5850, full: 11300, types: ['classroom', 'computer'] },
  { ids: ['801', '802'], cap: 30, half: 1950, full: 3500, types: ['classroom'] },
  
  // 50 cap
  { ids: ['402'], cap: 50, half: 8450, full: 16500, types: ['classroom', 'computer'] },
  { ids: ['407'], cap: 50, half: 8450, full: 16500, types: ['classroom'] },
  { ids: ['506'], cap: 50, half: 8450, full: 16500, types: ['classroom', 'computer'] },
  
  // 60 cap
  { ids: ['302'], cap: 60, half: 9350, full: 18300, types: ['classroom'] },
  { ids: ['803', '804'], cap: 60, half: 3450, full: 6500, types: ['classroom'] },
  { ids: ['507', '508', '509'], cap: 60, half: 9350, full: 18300, types: ['classroom', 'computer'] },
  
  // 65 cap
  { ids: ['303'], cap: 65, half: 10100, full: 19800, types: ['classroom'] },
  
  // 100 cap
  { ids: ['406'], cap: 100, half: 15100, full: 29800, types: ['classroom', 'computer'] },
  
  // 110 cap
  { ids: ['408'], cap: 110, half: 5250, full: 10100, types: ['classroom'] },
  { ids: ['510'], cap: 110, half: 5250, full: 10100, types: ['classroom'] },
  
  // 120-130 cap
  { ids: ['805'], cap: 120, half: 5250, full: 10100, types: ['classroom', 'catering'] },
  { ids: ['806'], cap: 130, half: 5250, full: 10100, types: ['classroom'] },
  
  // 2) Computer (unique ones not listed above)
  { ids: ['409'], cap: 40, half: 7650, full: 14900, types: ['computer'] },
  { ids: ['511'], cap: 40, half: 7650, full: 14900, types: ['computer'] },

  // 3) Theatre
  { ids: ['306'], name: 'Auditorium 306', cap: 300, half: 10050, full: 19700, types: ['theatre'] },
  
  // 4) Catering (unique ones)
  { ids: ['304'], cap: 160, half: 6200, full: 12000, types: ['catering'] },
  
  // 5) Tele-conference
  { ids: ['906', '911', '912', '913'], cap: 30, half: 1650, full: 2900, types: ['tele-conference'] }, // Set cap to 30 as representative
  { ids: ['915'], cap: 10, half: 2450, full: 4500, types: ['tele-conference'] },
  { ids: ['901'], cap: 25, half: 2950, full: 5500, types: ['tele-conference'] },
];

const images = [
  'https://images.unsplash.com/photo-1661475765552-9a0c80c8b44e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbmluZyUyMHJvb20lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY1MTYzOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1620145839899-0895f21e881f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzY1MTYzOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZHJvb20lMjBvZmZpY2V8ZW58MXx8fHwxNzY1MTYzOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1760611656007-f767a8082758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc2NTExNTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080'
];

let finalRooms = [];

roomsData.forEach(group => {
  group.ids.forEach(id => {
    let name = group.name ? group.name : `Room ${id}`;
    let img = images[parseInt(id) % images.length];
    finalRooms.push({
      id: id,
      name: name,
      type: group.types,
      priceHalfDay: group.half,
      priceFullDay: group.full,
      image: img,
      capacity: group.cap,
      size: group.cap * 2, // arbitrary
      amenities: group.types.includes('tele-conference') ? ['Tele-conference System', 'TV Screen'] : ['Whiteboard', 'Projector'],
      description: `Meeting room for up to ${group.cap} people.`,
      available: true
    });
  });
});

const output = `import { MeetingRoom } from '../App';\n\nexport const MEETING_ROOMS: MeetingRoom[] = ${JSON.stringify(finalRooms, null, 2)};\n`;

fs.writeFileSync('src/data/rooms.ts', output);
console.log('Successfully wrote src/data/rooms.ts');
