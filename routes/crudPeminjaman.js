const { PrismaClient } = require("@prisma/client");
var express = require('express');
var router = express.Router();

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



// Membuat Peminjaman
router.post('/peminjaman', async (req, res) => {
    try {
        const { userId, inventoryId, deskripsi, status, dateStart, dateEnd } = req.body;

        // Membuat peminjaman dengan nilai default dateStart dan dateEnd
        const newPeminjaman = await prisma.peminjaman.create({
            data: {
                userId: prisma.akun.id_akun, // Get data id_akun
                inventoryId,
                nama: prisma.inventory.nama,
                deskripsi,
                status: false,
                dateStart,
                dateEnd: null,
                outStock: false
            },
        });

        // Mengembalikan respons dengan data peminjaman
        res.status(201).json({ message: 'Peminjaman berhasil dibuat', data: newPeminjaman });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal membuat peminjaman' });
    }
});



// Update Validasi Peminjaman khusus Admin untuk Mensetujui Peminjaman
router.put('/peminjaman/admin/:id', authenticateToken, async (req, res) => {
    try {

        const { id } = req.params;
        const { inventoryId, deskripsi, status, dateStart, dateEnd } = req.body;

        if (req.akun.role === 'admin') {
            // Logika jika token dengan role admin
            const accPeminjaman = await prisma.peminjaman.update({
                where: { id_peminjaman: parseInt(id) },
                data: {
                    inventoryId,
                    dateEnd: null,
                    deskripsi,
                    status: true    // Update status sebagai bentuk validasi
                },
            });
            // Mengembalikan respons dengan data peminjaman
            res.status(201).json({ message: 'Peminjaman berhasil disetujui', data: accPeminjaman });
        } else {
            res.status(403).json({ error: 'Peminjaman gagal disetujui' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal memperbarui peminjaman' });
    }
});

// Jika Peminjaman telah disetujui, Update untuk Mengembalikan Peminjaman / Menyelesaikan Peminjaman
// Kemudian create History
router.put('/peminjaman/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil data peminjaman berdasarkan id
        const endPeminjaman = await prisma.peminjaman.findUnique({
            where: { id_peminjaman: parseInt(id) },
        });

        if (!endPeminjaman) {
            return res.status(404).json({ error: 'Peminjaman not found' });
        }

        // Update id_peminjaman
        const { userId, inventoryId, idPeminjaman, dateEnd, deskripsi, status, kondisi } = req.body;

        const updatedPeminjaman = await prisma.peminjaman.update({
            where: { id_peminjaman: parseInt(id) },
            data: {
                inventoryId,
                deskripsi,
                dateEnd,
                status
            },
        });

        // Buat entri history peminjaman
        const historyEntry = await prisma.history.create({
            data: {
                userId: prisma.akun.id_akun,
                inventoryId,
                idPeminjaman: endPeminjaman.id_peminjaman,
                kondisi
            },
        });

        res.status(200).json({ message: 'Peminjaman Selesai', data: historyEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal Menyelesaikan Peminjaman' });
    }
});

// Delete Peminjaman berdasarkan Id_Peminjaman
router.delete('/peminjaman/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPeminjaman = await prisma.peminjaman.delete({
            where: { id_peminjaman: parseInt(id) },
        });

        res.status(200).json({ message: 'Peminjaman berhasil dihapus', data: deletedPeminjaman });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal menghapus peminjaman' });
    }
});




module.exports = router;


// Cek semua data peminjaman
router.get("/peminjaman", async (req, res) => {
    try {
        const user = await prisma.peminjaman.findMany();
        res.send(user);
    } catch (err) {
        res.send("Gagal Mengambil Data Inventory");
    }
});

// Cek semua data History peminjaman
router.get("/peminjaman/history", async (req, res) => {
    try {
        const user = await prisma.history.findMany();
        res.send(user);
    } catch (err) {
        res.send("Gagal Mengambil Data History");
    }
});

// Delete History berdasarkan Id_History
router.delete('/peminjaman/history/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHistory = await prisma.history.delete({
            where: { id_history: parseInt(id) },
        });

        res.status(200).json({ message: 'History peminjaman berhasil dihapus', data: deletedHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal menghapus history' });
    }
});




// router.get('/peminjaman/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const peminjaman = await prisma.peminjaman.findUnique({
//             where: { id_peminjaman: parseInt(id) },
//         });

//         if (peminjaman) {
//             res.status(200).json(peminjaman);
//         } else {
//             res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Gagal mengambil data peminjaman' });
//     }
// });