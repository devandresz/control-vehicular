const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); 
const dataPath = './vehiculos.json';

// json
app.get('/api/vehiculos', (req, res) => {
    const data = fs.readFileSync(dataPath, 'utf8');
    res.json(JSON.parse(data));
});

// registro VIN 2
app.post('/api/vehiculos', (req, res) => {
    const data = fs.readFileSync(dataPath, 'utf8');
    const vehiculos = JSON.parse(data);
    const nuevo = req.body;
    // ensure color property exists so older records are compatible
    if (!nuevo.color) nuevo.color = '';

// IF ERROR VIN 2
    if (vehiculos.some(v => v.vin === nuevo.vin)) {
        return res.status(400).json({ message: "¡Error! Ese VIN ya está registrado." });
    }

    nuevo.id = vehiculos.length > 0 ? vehiculos[vehiculos.length - 1].id + 1 : 1;
    vehiculos.push(nuevo);
    fs.writeFileSync(dataPath, JSON.stringify(vehiculos, null, 2));
    res.status(201).json(nuevo);


});


app.put('/api/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const data = fs.readFileSync(dataPath, 'utf8');
    let vehiculos = JSON.parse(data);
    const index = vehiculos.findIndex(v => v.id === parseInt(id));

    if (index !== -1) {
        // make sure color is not undefined when editing
        const updates = { ...req.body };
        if (updates.color === undefined) updates.color = vehiculos[index].color || '';
        vehiculos[index] = { ...vehiculos[index], ...updates };
        fs.writeFileSync(dataPath, JSON.stringify(vehiculos, null, 2));
        res.json(vehiculos[index]);
    } else {
        res.status(404).json({ message: "No encontrado" });
    }
});


app.delete('/api/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const data = fs.readFileSync(dataPath, 'utf8');
    let vehiculos = JSON.parse(data);
    vehiculos = vehiculos.filter(v => v.id !== parseInt(id));
    fs.writeFileSync(dataPath, JSON.stringify(vehiculos, null, 2));
    res.json({ message: "Eliminado" });
});

app.listen(PORT, () => console.log(`Motor listo en el puerto ${PORT}`));