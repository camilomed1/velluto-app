# Velluto - Gelatería Artesanal

Aplicación web para la heladería Velluto.

- `frontend/`: React + Vite + styled-components
- `backend/`: Node.js + Express + MongoDB (Mongoose), autenticación con JWT en cookie

## Requisitos

- Node.js 20 o superior
- MongoDB corriendo en local (`mongodb://127.0.0.1:27017`)

## Cómo ejecutar

1. Backend

   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```

   `npm run seed` carga el menú (sabores, bases y toppings) y crea el usuario administrador
   definido en `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env`. El servidor queda en `http://localhost:4000`.

2. Frontend (en otra terminal)

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

   Abre `http://localhost:5173`.

## Estructura del backend

```
backend/src/
├── index.js            # servidor Express, middlewares y rutas
├── config.js           # variables de entorno
├── db.js               # conexión a MongoDB
├── seed.js             # datos iniciales
├── data/productos.js   # menú inicial
├── libs/jwt.js         # crear token
├── middlewares/
│   ├── validateToken.js  # authRequired: exige sesión
│   └── isAdmin.js        # adminRequired: exige rol admin
├── models/             # user, product, order
├── controllers/        # lógica de cada recurso
└── routes/             # endpoints
```

## API

Todas las rutas empiezan por `/api`. 🔒 = requiere sesión, 👑 = requiere rol admin.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/register` | Crear cuenta (`username`, `email`, `password`, `telefono` opcional) |
| POST | `/login` | Iniciar sesión (`email`, `password`) |
| POST | `/logout` | Cerrar sesión |
| GET | `/profile` 🔒 | Datos del usuario logueado (incluye teléfono y direcciones) |
| PUT | `/profile` 🔒 | Editar nombre y teléfono |
| PUT | `/profile/password` 🔒 | Cambiar contraseña (`passwordActual`, `passwordNueva`) |
| POST | `/profile/direcciones` 🔒 | Agregar dirección (`alias`, `direccion`, `comentario`, `principal`) |
| PUT | `/profile/direcciones/:id` 🔒 | Editar dirección o marcarla como principal |
| DELETE | `/profile/direcciones/:id` 🔒 | Eliminar dirección |
| GET | `/productos` | Menú disponible. Filtros: `?tipo=sabor\|base\|topping`, `?todos=true` |
| GET | `/productos/:id` | Un producto |
| POST | `/productos` 👑 | Crear producto |
| PUT | `/productos/:id` 👑 | Editar producto (precio, disponible, etc.) |
| DELETE | `/productos/:id` 👑 | Eliminar producto |
| POST | `/ordenes` | Crear pedido, con o sin cuenta. El backend calcula los precios |
| GET | `/ordenes/mias` 🔒 | Pedidos del usuario |
| GET | `/ordenes` 👑 | Todos los pedidos |
| PUT | `/ordenes/:id/estado` 👑 | Cambiar estado (`pendiente`, `preparando`, `en camino`, `entregado`, `cancelado`) |

Ejemplo de `POST /api/ordenes`:

```json
{
  "items": [
    { "base": "<id base>", "flavors": ["<id sabor>", "<id sabor>"], "toppings": ["<id topping>"] }
  ],
  "delivery": { "nombre": "Juan Pérez", "direccion": "Calle 1 # 2-3", "telefono": "3001234567", "comentario": "" }
}
```

## Flujo del pedido en el frontend

Ordenar → Pagar → Domicilio (nombre, teléfono, dirección y comentario) → Pedir ahora → Recibo con número real.

No hace falta cuenta para pedir. Con cuenta, el formulario se llena solo y se puede elegir una dirección guardada. En "Mi cuenta" el usuario edita sus datos, sus direcciones y ve sus pedidos.
