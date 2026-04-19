const express = require('express');
const app = express();

app.use(express.json());

let tareas = [];

// GET
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// POST
app.post('/tareas', (req, res) => {
    const tarea = {
        id: tareas.length + 1,
        nombre: req.body.nombre,
        completado: false
    };
    tareas.push(tarea);
    res.json(tarea);
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});