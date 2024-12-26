const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const dataFile = path.join(__dirname, 'appointments.json');

// 确保数据文件存在
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
}

// 启用 CORS
app.use(cors());

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.json());

// API 路由
app.post('/api/appointments', (req, res) => {
    const { name, phone, service, message } = req.body;
    const appointments = JSON.parse(fs.readFileSync(dataFile));
    
    const newAppointment = {
        id: Date.now(),
        name,
        phone,
        service,
        message,
        created_at: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    fs.writeFileSync(dataFile, JSON.stringify(appointments, null, 2));
    
    res.json(newAppointment);
});

app.get('/api/appointments', (req, res) => {
    const appointments = JSON.parse(fs.readFileSync(dataFile));
    res.json(appointments);
});

// 所有其他路由返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 设置端口
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

