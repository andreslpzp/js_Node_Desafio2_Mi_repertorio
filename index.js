const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
});

app.use(cors());
app.use(express.json());

//Ruta para devolver el index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

//Ruta para devolver el archivo canciones.json, sino existe lo crea y si existe lo devuelve
app.get("/canciones", (req, res) => {
    !fs.existsSync("./canciones.json") ? fs.writeFileSync("./canciones.json", "[]")
        : (() => {
            const canciones = JSON.parse(fs.readFileSync("./canciones.json", "utf-8"));
            res.send(canciones);
        })();
});

//Ruta para añadir una canción al archivo canciones.json 
app.post("/canciones", (req, res) => {
    const nuevaCancion = req.body;

    const canciones = JSON.parse(fs.readFileSync("./canciones.json", "utf-8"));
    canciones.push(nuevaCancion);
    fs.writeFileSync("./canciones.json", JSON.stringify(canciones, null, canciones.length));

    res.send("Canción agregada con exito");
});

//Ruta para editar una canción del archivo canciones.json
app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const cancion = req.body;

    const canciones = JSON.parse(fs.readFileSync("./canciones.json", "utf-8"));
    let index = canciones.findIndex((c) => c.id == id);
    canciones[index] = cancion;
    fs.writeFileSync("./canciones.json", JSON.stringify(canciones, null, canciones.length));

    res.send("Canción editada con exito");
});

//Ruta para eliminar una canción del archivo canciones.json
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const canciones = JSON.parse(fs.readFileSync("./canciones.json", "utf-8"));

    let index = canciones.findIndex((c) => c.id == id);
    canciones.splice(index, 1);
    fs.writeFileSync("./canciones.json", JSON.stringify(canciones, null, canciones.length));

    res.send("Canción eliminada con exito");
});