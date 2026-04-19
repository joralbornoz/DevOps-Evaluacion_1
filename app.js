const express = require('express');
const app = express();

app.use(express.json());

let tareas = [];

// GET
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

app.get('/tareas/completadas', (req, res) => {
   const completadas = tareas.filter(t => t.completado);
   res.json(completadas);
});

// POST
app.post('/tareas', (req, res) => {
    const tarea = {
        id: Date.now(),
        nombre: req.body.nombre,
        completado: false
    };
    tareas.push(tarea);
    res.json(tarea);
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});

app.put('/tareas/completar-todas', (req, res) => {
   tareas.forEach(t => t.completado = true);
   res.json(tareas);
});