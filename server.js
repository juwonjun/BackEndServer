const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3006;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'login.json');
const reportsFilePath = path.join(__dirname, 'reports.json');
const schedulesFilePath = path.join(__dirname, 'schedules.json');

if (!fs.existsSync(usersFilePath)) {
    const defaultUsers = [
        { username: "_Shaylyn0", password: "_98152540" },
        { username: "_hana05243", password: "hana05243_" },
        { username: "init0628", password: "hj913159!" },
        { username: "hwayeun", password: "icelangel12!@" },
        { username: "user4", password: "password4" }
    ];
    fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2));
}

function readFileSyncSafe(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

if (!fs.existsSync(reportsFilePath)) fs.writeFileSync(reportsFilePath, JSON.stringify([]));
if (!fs.existsSync(schedulesFilePath)) fs.writeFileSync(schedulesFilePath, JSON.stringify([]));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.status(200).json({ message: '로그인 성공', username: user.username });
    } else {
        res.status(400).json({ message: '잘못된 정보입니다.' });
    }
});

app.post('/report', (req, res) => {
    const reports = readFileSyncSafe(reportsFilePath);
    reports.push(req.body);
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));
    res.status(201).send('Report saved');
});

app.get('/report', (req, res) => {
    const reports = readFileSyncSafe(reportsFilePath);
    res.json(reports);
});

app.delete('/report/:index', (req, res) => {
    const reports = readFileSyncSafe(reportsFilePath);
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < reports.length) {
        reports.splice(index, 1); 
        fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2)); 
        res.status(200).json({ message: 'Report deleted' });
    } else {
        res.status(404).json({ message: 'Report not found' });
    }
});

app.post('/schedule', (req, res) => {
    const schedules = readFileSyncSafe(schedulesFilePath);
    schedules.push(req.body);
    fs.writeFileSync(schedulesFilePath, JSON.stringify(schedules, null, 2));
    res.status(201).send('Schedule saved');
});

app.get('/schedule', (req, res) => {
    const schedules = readFileSyncSafe(schedulesFilePath);
    res.json(schedules);
});

app.delete('/schedule/:index', (req, res) => {
    const schedules = readFileSyncSafe(schedulesFilePath);
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < schedules.length) {
        schedules.splice(index, 1);  
        fs.writeFileSync(schedulesFilePath, JSON.stringify(schedules, null, 2));
        res.status(200).json({ message: 'Schedule deleted' });
    } else {
        res.status(404).json({ message: 'Schedule not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
