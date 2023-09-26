import { createRequire } from 'node:module'
import express from 'express'
const require = createRequire(import.meta.url)
const datos = require('./datos.json')
const html =
  '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li><li>GET: /productos/precio/id</li><li>GET: /productos/nombre/id</li><li>GET: /usuarios/telefono/id</li><li>GET: /usuarios/nombre/id</li><li>GET: /productos/totalStock</li></ul>'
const app = express()
const exposedPort = 1234

// Ruta para la página principal
app.get('/', (req, res) => {
  res.status(200).send(html)
})



// Middleware para parsear el cuerpo JSON de las solicitudes
app.use(express.json())


// Definición de la ruta /usuarios/
app.get('/usuarios/', (req, res) => {
  try {
      let allUsers = datos.usuarios
      res.status(200).json(allUsers)
  } catch (error) {
      res.status(204).json({"message": error})
  }
})


// Definición de la ruta /productos/

app.get('/productos/', (req, res) =>{
  try {
      let allProducts = datos.productos

      res.status(200).json(allProducts)

  } catch (error) {
      res.status(204).json({"message": error})
  }
})


app.get('/productos/:id', (req, res) => {
  try {
      let productoId = parseInt(req.params.id)
      let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

      res.status(200).json(productoEncontrado)

  } catch (error) {
      res.status(204).json({"message": error})
  }
})

app.post('/productos', (req, res) => {
  try {
      let bodyTemp = ''

      req.on('data', (chunk) => {
          bodyTemp += chunk.toString()
      })
  
      req.on('end', () => {
          const data = JSON.parse(bodyTemp)
          req.body = data
          datos.productos.push(req.body)
      })
  
      res.status(201).json({"message": "success"})

  } catch (error) {
      res.status(204).json({"message": "error"})
  }
})


app.patch('/productos/:id', (req, res) => {
  let idProductoAEditar = parseInt(req.params.id)
  let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

  if (!productoAActualizar) {
      res.status(204).json({"message":"Producto no encontrado"})
  }

  let bodyTemp = ''

  req.on('data', (chunk) => {
      bodyTemp += chunk.toString()
  })

  req.on('end', () => {
      const data = JSON.parse(bodyTemp)
      req.body = data
      
      if(data.nombre){
          productoAActualizar.nombre = data.nombre
      }
      
      if (data.tipo){
          productoAActualizar.tipo = data.tipo
      }

      if (data.precio){
          productoAActualizar.precio = data.precio
      }

      res.status(200).send('Producto actualizado')
  })
})


app.delete('/productos/:id', (req, res) => {
  let idProductoABorrar = parseInt(req.params.id)
  let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

  if (!productoABorrar){
      res.status(204).json({"message":"Producto no encontrado"})
  }

  let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
  try {
       datos.productos.splice(indiceProductoABorrar, 1)
  res.status(200).json({"message": "success"})

  } catch (error) {
      res.status(204).json({"message": "error"})
  }
})


// 10. Crear el endpoint que permita obtener el total del stock actual de productos, la sumatoria de los precios individuales.
app.get('/productos/totalStock', (req, res) => {
  try {
      let totalStock = datos.productos.reduce((total, producto) => total + producto.precio, 0)
      res.status(200).json({"totalStock": totalStock})
  } catch (error) {
      res.status(204).json({"message": error})
  }
})



// 1. Crear el endpoint ‘/usuarios/’ que devuelva el listado completo de usuarios.
app.get('/usuarios/', (req, res) => {
  try {
    let allUsers = datos.usuarios
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(204).json({ message: error })
  }
})

// 2. Crear el endpoint ‘/usuarios/id’ que devuelva los datos de un usuario en particular por su número de id.
app.get('/usuarios/:id', (req, res) => {
  try {
    let userId = parseInt(req.params.id)
    let userEncontrado = datos.usuarios.find(usuario => usuario.id === userId)
    res.status(200).json(userEncontrado)
  } catch (error) {
    res.status(204).json({ message: error })
  }
})

// 3. Crear el endpoint ‘/usuarios/’ que permita guardar un nuevo usuario.
app.post('/usuarios', (req, res) => {
  try {
    let nuevoUsuario = req.body
    datos.usuarios.push(nuevoUsuario)
    res.status(201).json({ message: 'Usuario creado' })
  } catch (error) {
    res.status(204).json({ message: error })
  }
})

// 4. Crear el endpoint ‘/usuarios/id’ que permita modificar algún atributo de un usuario.
app.patch('/usuarios/:id', (req, res) => {
  let idUsuarioAEditar = parseInt(req.params.id)
  let usuarioAActualizar = datos.usuarios.find(
    usuario => usuario.id === idUsuarioAEditar
  )

  if (!usuarioAActualizar) {
    res.status(204).json({ message: 'Usuario no encontrado' })
  }

  try {
    const data = req.body
    if (data.nombre) {
      usuarioAActualizar.nombre = data.nombre
    }
    if (data.telefono) {
      usuarioAActualizar.telefono = data.telefono
    }
    // Agrega más atributos a actualizar según tus necesidades.
    res.status(200).json({ message: 'Usuario actualizado' })
  } catch (error) {
    res.status(204).json({ message: error })
  }
})

// 5. Crear el endpoint ‘/usuarios/id’ que permita borrar un usuario de los datos.
app.delete('/usuarios/:id', (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id)
    let usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idUsuarioABorrar)

    if (!usuarioABorrar){
        res.status(204).json({"message":"Usuario no encontrado"})
    }

    let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)
    try {
        datos.usuarios.splice(indiceUsuarioABorrar, 1)
        res.status(200).json({"message": "Usuario eliminado"})
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})






// 6. Crear el endpoint que permita obtener el precio de un producto que se indica por id.
app.get('/productos/precio/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (productoEncontrado) {
            res.status(200).json({"precio": productoEncontrado.precio})
        } else {
            res.status(204).json({"message": "Producto no encontrado"})
        }
    } catch (error) {
        res.status(204).json({"message": error})
    }
})


// 7. Crear el endpoint que permita obtener el nombre de un producto que se indica por id.
app.get('/productos/nombre/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (productoEncontrado) {
            res.status(200).json({"nombre": productoEncontrado.nombre})
        } else {
            res.status(204).json({"message": "Producto no encontrado"})
        }
    } catch (error) {
        res.status(204).json({"message": error})
    }
})


// 8. Crear el endpoint que permita obtener el teléfono de un usuario que se indica por id.
app.get('/usuarios/telefono/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

        if (usuarioEncontrado) {
            res.status(200).json({"telefono": usuarioEncontrado.telefono})
        } else {
            res.status(204).json({"message": "Usuario no encontrado"})
        }
    } catch (error) {
        res.status(204).json({"message": error})
    }
})

// 9. Crear el endpoint que permita obtener el nombre de un usuario que se indica por id.
app.get('/usuarios/nombre/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

        if (usuarioEncontrado) {
            res.status(200).json({"nombre": usuarioEncontrado.nombre})
        } else {
            res.status(204).json({"message": "Usuario no encontrado"})
        }
    } catch (error) {
        res.status(204).json({"message": error})
    }
})





app.use((req, res) => {
  res.status(404).send('<h1>Error 404</h1>')
})



app.listen(exposedPort, () => {
  console.log('Servidor Activo ' + exposedPort)
})



