const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware para configurar CORS y parsear JSON
const corsOptions = {
    origin: "http://localhost:3000", // Cambia a la URL permitida
};
app.use(cors(corsOptions));
app.use(express.json());

// Middleware para verificar la existencia del archivo canciones.json
const verificarArchivo = (req, res, next) => {
    if (!fs.existsSync("./canciones.json")) {
        fs.writeFileSync("./canciones.json", "[]");
    }
    next();
};
app.use(verificarArchivo);

// Funciones para manejar las operaciones del archivo
const leerCanciones = () => {
    return JSON.parse(fs.readFileSync("./canciones.json", "utf-8"));
};

const guardarCanciones = (canciones) => {
    fs.writeFileSync("./canciones.json", JSON.stringify(canciones, null, 2));
};

// Servidor en escucha
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
});

// Ruta para devolver el index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta para devolver el archivo canciones.json
app.get("/canciones", (req, res) => {
    try {
        const canciones = leerCanciones();
        res.send(canciones);
    } catch (error) {
        res.status(500).send("Error al leer el archivo de canciones");
    }
});

// Ruta para añadir una canción al archivo canciones.json
app.post("/canciones", (req, res) => {
    const nuevaCancion = req.body;

    if (!nuevaCancion.id || !nuevaCancion.titulo) {
        return res.status(400).send("Faltan datos obligatorios (id, titulo)");
    }

    try {
        const canciones = leerCanciones();
        canciones.push(nuevaCancion);
        guardarCanciones(canciones);
        res.send("Canción agregada con éxito");
    } catch (error) {
        res.status(500).send("Error al guardar la canción");
    }
});

// Ruta para editar una canción del archivo canciones.json
app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const cancionActualizada = req.body;

    try {
        const canciones = leerCanciones();
        const index = canciones.findIndex((c) => c.id == id);

        if (index === -1) {
            return res.status(404).send("Canción no encontrada");
        }

        canciones[index] = cancionActualizada;
        guardarCanciones(canciones);
        res.send("Canción editada con éxito");
    } catch (error) {
        res.status(500).send("Error al editar la canción");
    }
});

// Ruta para eliminar una canción del archivo canciones.json
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;

    try {
        const canciones = leerCanciones();
        const index = canciones.findIndex((c) => c.id == id);

        if (index === -1) {
            return res.status(404).send("Canción no encontrada");
        }

        canciones.splice(index, 1);
        guardarCanciones(canciones);
        res.send("Canción eliminada con éxito");
    } catch (error) {
        res.status(500).send("Error al eliminar la canción");
    }
});

