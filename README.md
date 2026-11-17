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

   `npm run seed` carga el menú (sabores, bases, toppings y categorías) y crea el usuario
   administrador definido en `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env`.
   El servidor queda en `http://localhost:4000`.

2. Frontend (en otra terminal)

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

   Abre `http://localhost:5173`.

Después de hacer `git pull`, vuelve a correr `npm install` en las dos carpetas por si hay paquetes nuevos.

## Roles

| Rol | Cómo se crea | Qué puede hacer |
|---|---|---|
| Sin cuenta | - | Ver el menú y hacer pedidos |
| `cliente` | Se registra en la página | Guardar datos y direcciones, ver sus pedidos en "Mi cuenta" |
| `admin` | Lo crea `npm run seed` | Panel de admin: pedidos, productos, categorías y domiciliarios |
| `domiciliario` | Lo crea el admin | Página "Entregas": tomar y entregar pedidos |

## Estructura del backend

```
backend/
├── uploads/              # fotos subidas desde el admin (no se suben a git)
└── src/
    ├── index.js          # servidor Express, middlewares y rutas
    ├── config.js         # variables de entorno
    ├── db.js             # conexión a MongoDB
    ├── seed.js           # datos iniciales
    ├── data/productos.js # menú inicial
    ├── libs/jwt.js       # crear token
    ├── middlewares/
    │   ├── validateToken.js  # authRequired / authOptional
    │   ├── isAdmin.js        # adminRequired
    │   ├── isDomiciliario.js # domiciliarioRequired
    │   └── upload.js         # subida de imágenes (multer)
    ├── models/           # user, product, category, order
    ├── controllers/      # lógica de cada recurso
    └── routes/           # endpoints
```

## API

Todas las rutas empiezan por `/api`.
Acceso: **Público**, **Sesión** (cualquier usuario logueado), **Admin** o **Domiciliario**.

### Autenticación y cuenta

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/register` | Público | Crear cuenta (`username`, `email`, `password`, `telefono` opcional) |
| POST | `/login` | Público | Iniciar sesión (`email`, `password`) |
| POST | `/logout` | Público | Cerrar sesión |
| GET | `/profile` | Sesión | Datos del usuario (incluye teléfono y direcciones) |
| PUT | `/profile` | Sesión | Editar nombre y teléfono |
| PUT | `/profile/password` | Sesión | Cambiar contraseña (`passwordActual`, `passwordNueva`) |
| POST | `/profile/direcciones` | Sesión | Agregar dirección (`alias`, `direccion`, `comentario`, `principal`) |
| PUT | `/profile/direcciones/:id` | Sesión | Editar dirección o marcarla como principal |
| DELETE | `/profile/direcciones/:id` | Sesión | Eliminar dirección |

### Productos y categorías

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/productos` | Público | Menú. Filtros: `?tipo=sabor\|base\|topping`, `?todos=true` (incluye ocultos) |
| GET | `/productos/:id` | Público | Un producto |
| POST | `/productos` | Admin | Crear producto |
| PUT | `/productos/:id` | Admin | Editar (precio, categoría, foto, `disponible`, `agotado`, `destacado`...) |
| DELETE | `/productos/:id` | Admin | Eliminar producto (y su foto) |
| POST | `/productos/imagen` | Admin | Subir foto (form-data, campo `imagen`, PNG/JPG/WEBP hasta 5 MB). Devuelve `{ image }` |
| GET | `/categorias` | Público | Categorías de sabores con cuántos sabores tiene cada una |
| POST | `/categorias` | Admin | Crear categoría (`name`) |
| PUT | `/categorias/:id` | Admin | Renombrar (también actualiza los sabores) |
| DELETE | `/categorias/:id` | Admin | Eliminar (solo si no tiene sabores) |

- `disponible: false` oculta el producto del menú.
- `agotado: true` lo deja visible pero no se puede pedir.
- `destacado: true` lo muestra en el carrusel de inicio.

### Pedidos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/ordenes` | Público | Crear pedido, con o sin cuenta. El backend calcula los precios |
| GET | `/ordenes/mias` | Sesión | Pedidos del usuario |
| GET | `/ordenes` | Admin | Todos los pedidos |
| PUT | `/ordenes/:id/estado` | Admin | Cambiar estado: `pendiente`, `preparando`, `en camino`, `entregado`, `cancelado` |
| PUT | `/ordenes/:id/domiciliario` | Admin | Asignar o cambiar domiciliario (`domiciliario`: id o `null`) |

Ejemplo de `POST /api/ordenes` (cada helado lleva de 1 a 3 sabores y hasta 3 toppings):

```json
{
  "items": [
    { "base": "<id base>", "flavors": ["<id sabor>", "<id sabor>"], "toppings": ["<id topping>"] }
  ],
  "delivery": { "nombre": "Juan Pérez", "direccion": "Calle 1 # 2-3", "telefono": "3001234567", "comentario": "" }
}
```

### Domiciliarios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/usuarios/domiciliarios` | Admin | Lista de domiciliarios |
| POST | `/usuarios/domiciliarios` | Admin | Crear domiciliario (`username`, `email`, `telefono`, `password`) |
| DELETE | `/usuarios/domiciliarios/:id` | Admin | Eliminar domiciliario (sus pedidos activos quedan sin asignar) |
| GET | `/entregas/disponibles` | Domiciliario | Pedidos en `preparando` sin domiciliario |
| GET | `/entregas/mias` | Domiciliario | Pedidos asignados al domiciliario |
| PUT | `/entregas/:id/tomar` | Domiciliario | Salir a entregar (el pedido pasa a `en camino`) |
| PUT | `/entregas/:id/entregar` | Domiciliario | Marcar como `entregado` |

## Flujo de un pedido

1. El cliente arma su helado en **Ordenar** y paga en **Domicilio** (nombre, teléfono, dirección y comentario). No necesita cuenta.
2. El admin ve el pedido en **Admin → Pedidos**, lo pasa a "preparando" y le asigna un domiciliario.
3. El domiciliario lo ve en **Entregas**, sale a entregarlo ("en camino") y lo marca como entregado.
4. Los pedidos entregados quedan en verde.
