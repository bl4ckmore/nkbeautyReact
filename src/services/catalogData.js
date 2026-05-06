export const SERVICES = [
  { id:1,  category:'Hair',          name:'Balayage & Toning',      desc:'Sun-kissed colour blended seamlessly through your lengths for a natural, lived-in result.',  dur:'3h',    price:180, icon:'◈', popular:true  },
  { id:2,  category:'Hair',          name:'Keratin Smoothing',       desc:'Transform frizzy hair into sleek perfection with a treatment that lasts up to four months.', dur:'2h30',  price:140, icon:'◆', popular:false },
  { id:3,  category:'Hair',          name:'Precision Cut & Style',   desc:'An expert cut tailored to your face shape and lifestyle, finished with a flawless blowout.',  dur:'75min', price:65,  icon:'✂', popular:false },
  { id:4,  category:'Nails',         name:'Classic Manicure',        desc:'Shaping, cuticle care, a hand massage, and your choice of polish from our curated palette.',  dur:'45min', price:35,  icon:'◇', popular:false },
  { id:5,  category:'Nails',         name:'Gel Extension Set',       desc:'Full sculpted gel extensions with any design — from barely-there minimalism to elaborate art.', dur:'2h',   price:85,  icon:'◉', popular:true  },
  { id:6,  category:'Nails',         name:'Luxury Pedicure',         desc:'Deep soak, exfoliation, callus removal, leg massage, and a flawless colour finish.',           dur:'60min', price:50,  icon:'❋', popular:false },
  { id:7,  category:'Skin',          name:'Deep Hydration Facial',   desc:'Intensive moisture treatment featuring hyaluronic acid serums and a cooling jade massage.',   dur:'60min', price:95,  icon:'✦', popular:true  },
  { id:8,  category:'Skin',          name:'Microdermabrasion',       desc:'Crystal exfoliation that resurfaces the skin and reveals a dramatically more radiant complexion.',dur:'75min',price:110, icon:'◌', popular:false },
  { id:9,  category:'Brows & Lashes',name:'Lash Lift & Tint',        desc:'A semi-permanent curl and darkening treatment that opens the eye for up to eight weeks.',      dur:'60min', price:70,  icon:'⌁', popular:true  },
  { id:10, category:'Brows & Lashes',name:'Brow Lamination',         desc:'Brush up, sculpt, and set your brows into their most full-looking, architectural form.',       dur:'50min', price:60,  icon:'⊹', popular:false },
  { id:11, category:'Body',          name:'Aromatherapy Massage',    desc:'Full-body relaxation with warm bespoke essential oil blends for deep de-stressing.',           dur:'90min', price:120, icon:'✿', popular:false },
  { id:12, category:'Body',          name:'Body Wrap & Scrub',       desc:'Sugar scrub exfoliation followed by a nourishing wrap to soften and illuminate the skin.',     dur:'90min', price:105, icon:'⊛', popular:false },
];

export const CATEGORIES = ['All', ...new Set(SERVICES.map(s => s.category))];
