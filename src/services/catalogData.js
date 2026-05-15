export const SERVICES = [
  { id:1,  category:'Hair',          name:'Balayage & Toning',      description:'Sun-kissed colour blended seamlessly through your lengths for a natural, lived-in result.',  duration:'3h',    price:180, icon:'◈', popular:true  },
  { id:2,  category:'Hair',          name:'Keratin Smoothing',       description:'Transform frizzy hair into sleek perfection with a treatment that lasts up to four months.', duration:'2h30',  price:140, icon:'◆', popular:false },
  { id:3,  category:'Hair',          name:'Precision Cut & Style',   description:'An expert cut tailored to your face shape and lifestyle, finished with a flawless blowout.',  duration:'75min', price:65,  icon:'✂', popular:false },
  { id:4,  category:'Nails',         name:'Classic Manicure',        description:'Shaping, cuticle care, a hand massage, and your choice of polish from our curated palette.',  duration:'45min', price:35,  icon:'◇', popular:false },
  { id:5,  category:'Nails',         name:'Gel Extension Set',       description:'Full sculpted gel extensions with any design — from barely-there minimalism to elaborate art.', duration:'2h',   price:85,  icon:'◉', popular:true  },
  { id:6,  category:'Nails',         name:'Luxury Pedicure',         description:'Deep soak, exfoliation, callus removal, leg massage, and a flawless colour finish.',           duration:'60min', price:50,  icon:'❋', popular:false },
  { id:7,  category:'Skin',          name:'Deep Hydration Facial',   description:'Intensive moisture treatment featuring hyaluronic acid serums and a cooling jade massage.',   duration:'60min', price:95,  icon:'✦', popular:true  },
  { id:8,  category:'Skin',          name:'Microdermabrasion',       description:'Crystal exfoliation that resurfaces the skin and reveals a dramatically more radiant complexion.',duration:'75min',price:110, icon:'◌', popular:false },
  { id:9,  category:'Brows & Lashes',name:'Lash Lift & Tint',        description:'A semi-permanent curl and darkening treatment that opens the eye for up to eight weeks.',      duration:'60min', price:70,  icon:'⌁', popular:true  },
  { id:10, category:'Brows & Lashes',name:'Brow Lamination',         description:'Brush up, sculpt, and set your brows into their most full-looking, architectural form.',       duration:'50min', price:60,  icon:'⊹', popular:false },
  { id:11, category:'Body',          name:'Aromatherapy Massage',    description:'Full-body relaxation with warm bespoke essential oil blends for deep de-stressing.',           duration:'90min', price:120, icon:'✿', popular:false },
  { id:12, category:'Body',          name:'Body Wrap & Scrub',       description:'Sugar scrub exfoliation followed by a nourishing wrap to soften and illuminate the skin.',     duration:'90min', price:105, icon:'⊛', popular:false },
];

export const CATEGORIES = ['All', ...new Set(SERVICES.map(s => s.category))];
