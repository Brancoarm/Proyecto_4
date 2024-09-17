const fs = require('fs').promises;
const path = require('path');

// Ruta del archivo que contiene los datos de reservas.
const filePath = path.join(__dirname, '../models/reservas.json');

// Lee las reservas desde el archivo JSON de manera asíncrona.
const leerReservas = async () => {
  try {
    console.log('Leyendo archivo de reservas...');
    const data = await fs.readFile(filePath, 'utf8');
    const reservas = JSON.parse(data);
    
    if (Array.isArray(reservas)) {
      console.log('Reservas cargadas correctamente:', reservas.length, 'reservas encontradas.');
      return reservas;
    } else {
      throw new Error('El archivo JSON no contiene un array válido.');
    }
  } catch (err) {
    console.error('Error al leer el archivo reservas.json:', err.message);
    return [];
  }
};

// Guarda las reservas en el archivo JSON de manera asíncrona.
const guardarReservas = async (reservas) => {
  try {
    console.log('Guardando reservas en el archivo...');
    await fs.writeFile(filePath, JSON.stringify(reservas, null, 2), 'utf8');
    console.log('Reservas guardadas correctamente.');
  } catch (err) {
    console.error('Error al guardar en el archivo reservas.json:', err.message);
  }
};

// Obtiene todas las reservas aplicando filtros según parámetros de consulta.
const obtenerReservas = async (req, res) => {
  const { hotel, fecha_inicio, fecha_fin, tipo_habitacion, estado, num_huespedes } = req.query;
  
  console.log('Parámetros recibidos en la consulta:', req.query);
  
  let reservasFiltradas = await leerReservas();
  console.log('Reservas antes del filtrado:', reservasFiltradas);

  
// Filtrar por nombre del hotel si se proporciona
if (hotel) {
  reservasFiltradas = reservasFiltradas.filter((reserva) =>
    reserva.hotel.toLowerCase() === hotel.toLowerCase()
  );

  if (reservasFiltradas.length === 0) {
    return res.status(404).json({ mensaje: `No se encontraron reservas para el hotel ${hotel}.` });
  }
}

  // Aplicar filtrado por rango de fechas si se proporciona.
  const dayjs = require('dayjs');
  const isBetween = require('dayjs/plugin/isBetween');
  const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
  const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

  dayjs.extend(isBetween);
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);

  if (fecha_inicio && fecha_fin) {
    console.log(`Filtrando por fechas: Desde ${fecha_inicio} hasta ${fecha_fin}`);
    const fechaInicio = dayjs(fecha_inicio, 'YYYY-MM-DD');
    const fechaFin = dayjs(fecha_fin, 'YYYY-MM-DD');

    if (!fechaInicio.isValid() || !fechaFin.isValid()) {
      console.log('Fechas inválidas proporcionadas.');
      return res.status(400).json({ error: 'Fechas inválidas. Utilice el formato YYYY-MM-DD.' });
    }

    reservasFiltradas = reservasFiltradas.filter((reserva) => {
      const fechaReservaInicio = dayjs(reserva.fecha_inicio, 'YYYY-MM-DD');
      const fechaReservaFin = dayjs(reserva.fecha_fin, 'YYYY-MM-DD');
      return fechaReservaInicio.isSameOrAfter(fechaInicio) && fechaReservaFin.isSameOrBefore(fechaFin);
    });

    if (reservasFiltradas.length === 0) {
      console.log('No se encontraron reservas en el rango de fechas proporcionado.');
      return res.status(404).json({ mensaje: `No se encontraron reservas en el rango de fechas proporcionado.` });
    }
  }

  // Filtrar por tipo de habitación si se proporciona.
  if (tipo_habitacion) {
    console.log(`Filtrando por tipo de habitación: ${tipo_habitacion}`);
    reservasFiltradas = reservasFiltradas.filter((reserva) =>
      reserva.tipo_habitacion.toLowerCase() === tipo_habitacion.toLowerCase()
    );

    if (reservasFiltradas.length === 0) {
      console.log(`No se encontraron reservas con tipo de habitación ${tipo_habitacion}.`);
      return res.status(404).json({ mensaje: `No se encontraron reservas con tipo de habitación ${tipo_habitacion}.` });
    }
  }

  // Filtrar por estado de la reserva si se proporciona.
  if (estado) {
    console.log(`Filtrando por estado: ${estado}`);
    reservasFiltradas = reservasFiltradas.filter((reserva) =>
      reserva.estado.toLowerCase() === estado.toLowerCase()
    );

    if (reservasFiltradas.length === 0) {
      console.log(`No se encontraron reservas con estado ${estado}.`);
      return res.status(404).json({ mensaje: `No se encontraron reservas con estado ${estado}.` });
    }
  }

  // Filtrar por número de huéspedes.
  if (num_huespedes) {
    console.log(`Filtrando por número de huéspedes: ${num_huespedes}`);
    reservasFiltradas = reservasFiltradas.filter((reserva) => reserva.num_huespedes === parseInt(num_huespedes));

    if (reservasFiltradas.length === 0) {
      console.log(`No se encontraron reservas con ${num_huespedes} huéspedes.`);
      return res.status(404).json({ mensaje: `No se encontraron reservas con ${num_huespedes} huéspedes.` });
    }
  }

  console.log('Reservas después de los filtros aplicados:', reservasFiltradas);

  res.json({
    mensaje: reservasFiltradas.length ? "Reservas encontradas:" : "No se encontraron reservas.",
    reservas: reservasFiltradas
  });
};

// Crear una nueva reserva y almacenarla.
const crearReserva = async (req, res) => {
  const reservas = await leerReservas();
  
  const nuevaReserva = {
    id: reservas.length + 1,
    nombre: req.body.nombre,
    habitacion: req.body.habitacion,
    hotel: req.body.hotel,
    tipo_habitacion: req.body.tipo_habitacion,
    fecha_inicio: req.body.fecha_inicio,
    fecha_fin: req.body.fecha_fin,
    estado: req.body.estado,
    num_huespedes: req.body.num_huespedes
  };

  console.log('Creando nueva reserva:', nuevaReserva);
  reservas.push(nuevaReserva);
  await guardarReservas(reservas);
  res.status(201).json(nuevaReserva);
};

// Obtener detalles de una reserva específica por su ID.
const obtenerReservaPorId = async (req, res) => {
  const reservas = await leerReservas();
  const id = parseInt(req.params.id);
  const reserva = reservas.find(r => r.id === id);

  console.log(`Buscando reserva con ID: ${id}`);
  if (!reserva) {
    console.log('Reserva no encontrada.');
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  res.json(reserva);
};

// Actualizar una reserva existente por su ID.
const actualizarReserva = async (req, res) => {
  const reservas = await leerReservas();
  const id = parseInt(req.params.id);
  const reserva = reservas.find(r => r.id === id);

  console.log(`Buscando reserva con ID: ${id} para actualizar.`);
  if (!reserva) {
    console.log('Reserva no encontrada.');
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  // Actualizar los campos de la reserva si se proporcionan.
  reserva.nombre = req.body.nombre || reserva.nombre;
  reserva.habitacion = req.body.habitacion || reserva.habitacion;
  reserva.hotel = req.body.hotel || reserva.hotel;
  reserva.tipo_habitacion = req.body.tipo_habitacion || reserva.tipo_habitacion;
  reserva.fecha_inicio = req.body.fecha_inicio || reserva.fecha_inicio;
  reserva.fecha_fin = req.body.fecha_fin || reserva.fecha_fin;
  reserva.estado = req.body.estado || reserva.estado;
  reserva.num_huespedes = req.body.num_huespedes || reserva.num_huespedes;

  console.log('Actualizando reserva:', reserva);
  await guardarReservas(reservas);
  res.json(reserva);
};

// Eliminar una reserva por su ID.
const eliminarReserva = async (req, res) => {
  const reservas = await leerReservas();
  const id = parseInt(req.params.id);
  const reservaIndex = reservas.findIndex(r => r.id === id);

  console.log(`Buscando reserva con ID: ${id} para eliminar.`);
  if (reservaIndex === -1) {
    console.log('Reserva no encontrada.');
    return res.status(404).json({ error: `No se encontró ninguna reserva con el ID ${id}` });
  }

  reservas.splice(reservaIndex, 1);
  console.log(`Reserva con ID: ${id} eliminada.`);
  await guardarReservas(reservas);
  res.status(204).send();
};

// Obtener un resumen del total de reservas.
const obtenerResumenReservas = async (req, res) => {
  try {
    const reservas = await leerReservas();

    if (reservas.length === 0) {
      console.log('No hay reservas registradas.');
      return res.status(404).json({ error: 'No hay reservas registradas' });
    }

    const totalReservas = reservas.length;
    console.log(`Total de reservas registradas: ${totalReservas}`);
    res.json({ totalReservas });
  } catch (error) {
    console.error('Error al obtener el resumen de reservas:', error.message);
    res.status(500).json({ error: 'Error al obtener el resumen de reservas' });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
  obtenerResumenReservas
};
