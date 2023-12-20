const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, akun) => {
        if (err) return res.sendStatus(403);
        req.akun = akun;
        next();
    });
};



// Endpoint untuk registrasi
router.post('/regis', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    const cekUsername = await prisma.akun.findUnique({
        where: { username },
    });
    // username yang dibuat harus unik
    if (cekUsername) {
        return res.status(400).json({ msg: 'User sudah digunakan' });
    }
    // password dan confirm Password harus sama
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "password dan confirmPassword tidak sama" });
    }

    try {
        // Algoritma untuk enkripsi Password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Membuat akun baru dengan password yang sudah dihash dan dikirim ke database
        const newAkun = await prisma.akun.create({
            data: {
                // Field yang harus diisi saat Registrasi
                username,
                nama: req.body.nama,
                password: hashedPassword,
                // Tambahkan Field Konfirmasi Password
                role: req.body.role,
            },
        });

        res.status(200).json({ msg: "Registrasi Berhasil" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Register Server Error' });
    }
});




// Endpoint untuk login
router.post('/login', async (req, res) => {
    // Field Username dan Password yang harus diisi untuk Proses Login
    const { username, password } = req.body;

    const cekAkun = await prisma.akun.findUnique({
        where: { username: username },
    });
    // Cek username apakah ada di Database
    if (!cekAkun) return res.status(404).json({ error: 'User not found' });

    // Membandingkan Password dengan HashedPassword di Database
    const validPassword = await bcrypt.compare(password, cekAkun.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    // Generate Token berdasarkan username dan role
    const token = jwt.sign({ username: cekAkun.username, role: cekAkun.role },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED_IN });

    res.json({ token });
});



// Endpoint terproteksi untuk mendapatkan data dengan role tertentu
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        if (req.akun.role === 'admin') {
            // Logika jika token dengan role admin
            const adminData = await prisma.akun.findMany();

            res.json({ message: 'Admin Page', data: adminData, page: 'admin_dashboard' });
        } else if (req.akun.role === 'member' || req.akun.role === 'user') {
            // Logika jika token dengan role member
            const memberData = await prisma.akun.findMany();

            res.json({ message: 'Member Page', data: memberData, page: 'member_home' });
        } else {
            res.status(403).json({ error: 'Role not recognized' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;
