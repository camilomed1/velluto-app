export const SABORES = [
  {
    id: "vainilla",
    name: "Vainilla Artesanal",
    category: "Clásicos",
    description: "Elaborado con vainas reales de vainilla para un sabor suave y elegante.",
    price: 8500,
    image: "/sabores/vainilla.png",
    color: "#FFF9C4" // Amarillo crema suave
  },
  {
    id: "pistacho",
    name: "Pistacho",
    category: "Clásicos",
    description: "Helado artesanal con pistachos tostados directamente de Milan, Italia.",
    price: 8500,
    image: "/sabores/pistacho.png",
    color: "#C5E1A5" // Verde pistacho
  },
  {
    id: "chocolate",
    name: "Chocolate Intenso",
    category: "Clásicos",
    description: "Chocolate oscuro con notas profundas y textura cremosa.",
    price: 8500,
    image: "/sabores/chocolate.png",
    color: "#4E342E" // Café oscuro profundo
  },
  {
    id: "fresa",
    name: "Fresa Natural",
    category: "Frutales",
    description: "Fresas frescas trituradas para un sabor auténtico y refrescante.",
    price: 8500,
    image: "/sabores/fresa.png",
    color: "#FF8A80" // Rosa fresa
  },
  {
    id: "cookies",
    name: "Cookies & Cream",
    category: "Cremosos",
    description: "Base cremosa con trozos generosos de galleta crujiente.",
    price: 9500,
    image: "/sabores/cookies.png",
    color: "#E0E0E0" // Gris claro con textura (puedes usar blanco hueso)
  },
  {
    id: "caramelo",
    name: "Caramelo Salado",
    category: "Cremosos",
    description: "Dulce de leche artesanal con un toque de sal marina.",
    price: 9500,
    image: "/sabores/caramelo.png",
    color: "#FFB74D" // Naranja caramelo
  },
  {
    id: "avellana",
    name: "Chocolate Avellana",
    category: "Cremosos",
    description: "Crema suave con avellanas tostadas y cacao.",
    price: 9500,
    image: "/sabores/avellana.png",
    color: "#795548" // Marrón avellana
  },
  // 🌿 PREMIUM
  {
    id: "reeses",
    name: "Reese's",
    category: "Premium",
    description: "Helado artesanal con piezas de Reese's.",
    price: 11500,
    image: "/sabores/reeses.png",
    color: "#FF9800" // Naranja intenso de la marca
  },
  {
    id: "cafe",
    name: "Juan Valdez",
    category: "Premium",
    description: "Café de origen Colombiano con notas profundas y ligeramente amargas.",
    price: 10500,
    image: "/sabores/cafe.png",
    color: "#6D4C41" // Café Juan Valdez
  },
  {
    id: "milkyway",
    name: "Milky Way",
    category: "Premium",
    description: "Helado del dulce insignia: Milky Way.",
    price: 11500,
    image: "/sabores/milkyway.png",
    color: "#3E2723" // Marrón chocolate leche
  },
  {
    id: "mango",
    name: "Mango Tropical",
    category: "Frutales",
    description: "Mango maduro con textura suave y refrescante.",
    price: 8500,
    image: "/sabores/mango.png",
    color: "#FFD54F" // Amarillo mango
  },
  {
    id: "frutos_rojos",
    name: "Frutos del Bosque",
    category: "Frutales",
    description: "Mezcla de mora, arándano y frambuesa.",
    price: 9500,
    image: "/sabores/frutos.png",
    color: "#AD1457" // Púrpura/Magenta de frutos rojos
  }
];

export const BASES = [
  {
    id: 1,
    name: "Cono",
    price: 0, 
    description: "Cono artesanal crocante",
    type: "wafer" // Para identificar la forma visual
  },
  {
    id: 2,
    name: "Vaso",
    price: 0,
    description: "Vaso minimalista premium",
    type: "cup"
  },
  {
    id: 3,
    name: "Brownie",
    price: 4500, 
    description: "Base tibia de brownie",
    type: "cake"
  },
  {
    id: 4,
    name: "Waffle Bowl",
    price: 3000,
    description: "Canasta dulce de waffle",
    type: "bowl"
  }
];

export const TOPPINGS = [
  { id: 1, name: "Chispas de chocolate", price: 1500 },
  { id: 2, name: "Oreo triturada", price: 1500 },
  { id: 3, name: "Caramelo", price: 1200 },
  { id: 4, name: "Fudge de chocolate", price: 1200 },
  { id: 5, name: "Fresas", price: 2000 },
  { id: 6, name: "Marshmallows", price: 1200 },
  { id: 7, name: "Maní crocante", price: 1500 },
  { id: 8, name: "Galleta", price: 1500 }
];