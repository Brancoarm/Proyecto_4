// Propósito: Manejar las rutas de la API relacionadas con las reservas.
const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservasController.js");

// Rutas de reservas:

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Obtener todas las reservas o aplicar filtros.
 *     description: Devuelve una lista de reservas, con la opción de aplicar filtros como nombre del hotel, fechas, tipo de habitación, estado y número de huéspedes.
 *     parameters:
 *       - in: query
 *         name: hotel
 *         schema:
 *           type: string
 *         description: Filtra las reservas por nombre del hotel.
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango de fechas (formato YYYY-MM-DD).
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango de fechas (formato YYYY-MM-DD).
 *       - in: query
 *         name: tipo_habitacion
 *         schema:
 *           type: string
 *         description: Filtra por tipo de habitación (ej. "doble", "suite").
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtra por el estado de la reserva (ej. "PENDIENTE", "CONFIRMADA").
 *       - in: query
 *         name: num_huespedes
 *         schema:
 *           type: integer
 *         description: Filtra por el número de huéspedes.
 *     responses:
 *       200:
 *         description: Lista de reservas obtenidas correctamente.
 *       404:
 *         description: No se encontraron reservas con los filtros aplicados.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/", reservasController.obtenerReservas);

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva.
 *     description: Crea una nueva reserva en el hotel y devuelve los detalles de la misma.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del huésped.
 *                 example: "Luis Torres"
 *               habitacion:
 *                 type: string
 *                 description: Número de la habitación reservada.
 *                 example: "109"
 *               hotel:
 *                 type: string
 *                 description: Nombre del hotel.
 *                 example: "Hotel Paraíso"
 *               tipo_habitacion:
 *                 type: string
 *                 description: Tipo de habitación reservada (ej. "doble", "suite").
 *                 example: "SUITE"
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la reserva (formato YYYY-MM-DD).
 *                 example: "2024-10-15"
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la reserva (formato YYYY-MM-DD).
 *                 example: "2024-10-30"
 *               estado:
 *                 type: string
 *                 description: Estado de la reserva (ej. "PENDIENTE", "CONFIRMADA").
 *                 example: "PENDIENTE"
 *               num_huespedes:
 *                 type: integer
 *                 description: Número total de huéspedes.
 *                 example: 3
 *             required:
 *               - nombre
 *               - habitacion
 *               - hotel
 *               - tipo_habitacion
 *               - fecha_inicio
 *               - fecha_fin
 *               - estado
 *               - num_huespedes
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de confirmación.
 *                   example: "Reserva creada exitosamente."
 *                 reserva:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la reserva creada.
 *                       example: 9
 *                     nombre:
 *                       type: string
 *                       description: Nombre del huésped.
 *                       example: "Luis Torres"
 *                     habitacion:
 *                       type: string
 *                       description: Número de la habitación reservada.
 *                       example: "109"
 *                     hotel:
 *                       type: string
 *                       description: Nombre del hotel.
 *                       example: "Hotel Paraíso"
 *                     tipo_habitacion:
 *                       type: string
 *                       description: Tipo de habitación reservada.
 *                       example: "SUITE"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                       description: Fecha de inicio de la reserva.
 *                       example: "2024-10-15"
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *                       description: Fecha de fin de la reserva.
 *                       example: "2024-10-30"
 *                     estado:
 *                       type: string
 *                       description: Estado de la reserva.
 *                       example: "PENDIENTE"
 *                     num_huespedes:
 *                       type: integer
 *                       description: Número de huéspedes en la reserva.
 *                       example: 3
 *       400:
 *         description: Error de validación. Faltan campos requeridos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *                   example: "Todos los campos son requeridos."
 */
router.post("/", reservasController.crearReserva);

/**
 * @swagger
 * /api/reservas/resumen:
 *   get:
 *     summary: Obtener un resumen del total de reservas.
 *     description: Devuelve el número total de reservas registradas en el sistema.
 *     responses:
 *       200:
 *         description: Resumen del total de reservas obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReservas:
 *                   type: integer
 *                   description: El número total de reservas.
 *                   example: 15
 *       404:
 *         description: No hay reservas registradas.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/resumen", reservasController.obtenerResumenReservas);

/**
 * @swagger
 * /api/reservas/{id}:
 *   get:
 *     summary: Obtener una reserva por ID.
 *     description: Devuelve los detalles de una reserva específica basada en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a obtener.
 *         example: 9
 *     responses:
 *       200:
 *         description: Reserva obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Información sobre la reserva.
 *                   example: "Información de la reserva con ID: 9."
 *                 reserva:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la reserva.
 *                       example: 9
 *                     nombre:
 *                       type: string
 *                       description: Nombre del huésped.
 *                       example: "Luis Torres"
 *                     habitacion:
 *                       type: string
 *                       description: Número de la habitación reservada.
 *                       example: "109"
 *                     hotel:
 *                       type: string
 *                       description: Nombre del hotel.
 *                       example: "Hotel Paraíso"
 *                     tipo_habitacion:
 *                       type: string
 *                       description: Tipo de habitación reservada.
 *                       example: "SUITE"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                       description: Fecha de inicio de la reserva.
 *                       example: "2024-10-15"
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *                       description: Fecha de fin de la reserva.
 *                       example: "2024-10-30"
 *                     estado:
 *                       type: string
 *                       description: Estado de la reserva.
 *                       example: "PENDIENTE"
 *                     num_huespedes:
 *                       type: integer
 *                       description: Número de huéspedes.
 *                       example: 3
 *       404:
 *         description: Reserva no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/:id", reservasController.obtenerReservaPorId);

/**
 * @swagger
 * /api/reservas/{id}:
 *   put:
 *     summary: Actualizar una reserva existente.
 *     description: Actualiza los detalles de una reserva específica basada en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar.
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del huésped.
 *                 example: "Luis Torres"
 *               habitacion:
 *                 type: string
 *                 description: Nuevo número de la habitación.
 *                 example: "109"
 *               hotel:
 *                 type: string
 *                 description: Nuevo nombre del hotel.
 *                 example: "Hotel Paraíso"
 *               tipo_habitacion:
 *                 type: string
 *                 description: Nuevo tipo de habitación.
 *                 example: "SUITE"
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de inicio (formato YYYY-MM-DD).
 *                 example: "2024-10-15"
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de fin (formato YYYY-MM-DD).
 *                 example: "2024-10-30"
 *               estado:
 *                 type: string
 *                 description: Nuevo estado de la reserva.
 *                 example: "PENDIENTE"
 *               num_huespedes:
 *                 type: integer
 *                 description: Nuevo número de huéspedes.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente.
 *       404:
 *         description: Reserva no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
router.put("/:id", reservasController.actualizarReserva);

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva.
 *     description: Elimina una reserva específica basada en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar.
 *         example: 9
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                   example: "Reserva con ID: 9 eliminada exitosamente."
 *       404:
 *         description: Reserva no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error si la reserva no es encontrada.
 *                   example: "Reserva no encontrada."
 *       500:
 *         description: Error en el servidor.
 */
router.delete("/:id", reservasController.eliminarReserva);

// Exporta el router para ser utilizado en la aplicación principal.
module.exports = router;
