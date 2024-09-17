// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");

// Importar Swagger UI y Swagger Jsdoc para la documentación de la API
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Importar el módulo Path para manejar rutas de archivos
const path = require("path");

// Crear una instancia de la aplicación Express
const app = express();

// Definir hostname y puerto desde las variables de entorno o valores por defecto
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Configuración de Swagger para documentar la API
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Reservas Hoteleras",
      version: "1.0.0",
      description: "Documentación de la API para gestionar reservas hoteleras - BOOTCAMPUDD - Branco Riffo Miranda",
    },
    servers: [
      {
        url: `http://${HOSTNAME}:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// Configurar Swagger UI para mostrar la documentación
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta principal que sirve un archivo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Importar las rutas de reservas
const reservasRoutes = require("./routes/reservasRoutes.js");

// Usar las rutas de reservas con prefijo /api/reservas
app.use("/api/reservas", reservasRoutes);

// Iniciar el servidor en el puerto y hostname configurados
app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor iniciado en http://${HOSTNAME}:${PORT}`);
});
