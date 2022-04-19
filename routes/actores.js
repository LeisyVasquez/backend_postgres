const { Router } = require('express')
const router = Router()
const { pool } = require('../database/config')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})
const { bodySchema } = require('../schemas/actor')

router.get('/', (req, res) => {
  res.send('Hello world')
})

router.get('/actor', async (req, res) => {
  let cliente = await pool.connect()
  const { user, password } = req.query

  try {
    let result = await cliente.query(
      `SELECT * FROM actores WHERE contrasena = $1 AND correo = $2`,
      [password, user]
    )
    res.json(result.rows)
  } catch (err) {
    console.log({ err })
    res.status(500).json({ error: 'Internal error server' })
  } finally {
    //(Liberar) libera un cliente adquirido de vuelta al pool.
    //Debes llamar a client.release cuando hayas terminado con un cliente. Si te olvidas de liberar al cliente, tu aplicación agotará rápidamente los clientes disponibles e inactivos en el pool y todas las llamadas posteriores a pool.connect se agotarán con un error o se colgarán indefinidamente si tienes configurado connectionTimeoutMillis a 0.
    // El true significa que indicará al pool que desconecte y destruya este cliente, dejando un espacio dentro de sí mismo para un nuevo cliente.
    // indicar al pool que destruya a este cliente
    cliente.release(true)
  }
})

router.post('/actor', validator.body(bodySchema), async (req, res) => {
  try {
    const {
      documento,
      tipo_documento,
      nombres,
      apellidos,
      contrasena,
      correo,
      telefono_celular,
      numero_expediente,
      genero,
      fecha_nacimiento,
      estado_actor_id,
      institucion_id,
      tipo_actor_id,
      fecha_creacion,
      fecha_actualizacion
    } = req.body
    const client = await pool.connect()
    const response = await client.query(
      `INSERT INTO actores(documento, tipo_documento, nombres, apellidos, contrasena, correo, telefono_celular, numero_expediente, genero, fecha_nacimiento, estado_actor_id, institucion_id, tipo_actor_id, fecha_creacion,fecha_actualizacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
      [
        documento,
        tipo_documento,
        nombres,
        apellidos,
        contrasena,
        correo,
        telefono_celular,
        numero_expediente,
        genero,
        fecha_nacimiento,
        estado_actor_id,
        institucion_id,
        tipo_actor_id,
        fecha_creacion,
        fecha_actualizacion
      ]
    )
    if (response.rowCount > 0) {
      res.json({
        id: response.rows[0].id,
        documento: documento,
        tipo_documento: tipo_documento,
        nombres: nombres,
        apellidos: apellidos,
        contrasena: contrasena,
        correo: correo,
        telefono_celular: telefono_celular,
        numero_expediente: numero_expediente,
        genero: genero,
        fecha_nacimiento: fecha_nacimiento,
        estado_actor_id: estado_actor_id,
        institucion_id: institucion_id,
        tipo_actor_id: tipo_actor_id,
        fecha_creacion: fecha_creacion,
        fecha_actualizacion: fecha_actualizacion
      })
    } else {
      res.json({ message: 'No se pudo crear el actor' })
    }
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({ errorCode: e.errno, message: 'Error en el servidor' })
  }
})

router.put('/actor/:id', async (req, res) => {
  let cliente = await pool.connect()
  const { id } = req.params
  const {
    documento,
    tipo_documento,
    nombres,
    apellidos,
    contrasena,
    correo,
    telefono_celular,
    numero_expediente,
    genero,
    fecha_nacimiento,
    estado_actor_id,
    institucion_id,
    tipo_actor_id,
    fecha_creacion,
    fecha_actualizacion
  } = req.body
  try {
    const result = await cliente.query(
      `UPDATE actores SET documento = $1, tipo_documento = $2, nombres = $3, apellidos = $4, contrasena = $5, correo = $6, telefono_celular = $7, numero_expediente = $8, genero = $9, fecha_nacimiento = $10, estado_actor_id = $11, institucion_id = $12, tipo_actor_id = $13, fecha_creacion = $14, fecha_actualizacion = $15 WHERE id = $16`,
      [
        documento,
        tipo_documento,
        nombres,
        apellidos,
        contrasena,
        correo,
        telefono_celular,
        numero_expediente,
        genero,
        fecha_nacimiento,
        estado_actor_id,
        institucion_id,
        tipo_actor_id,
        fecha_creacion,
        fecha_actualizacion,
        id
      ]
    )
    console.log(result.rowCount)
    if (result.rowCount > 0) {
      res.json({ message: 'Actualización realizada correctamente' })
    } else {
      res
        .status(403)
        .json({ message: 'Ocurrio un envento inesperado, intente de nuevo' })
    }
  } catch (err) {
    console.log({ err })
    res.status(500).json({ error: 'Internal error server' })
  }
})
module.exports = router
