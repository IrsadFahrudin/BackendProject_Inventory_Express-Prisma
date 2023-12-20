// const { PrismaClient } = require("@prisma/client");
// var express = require('express');
// var router = express.Router();

// const prisma = new PrismaClient();



// // Cek semua data peminjaman
// router.get("/", async (req, res) => {
//     try {
//         const user = await prisma.peminjaman.findMany();
//         res.send(user);
//     } catch (err) {
//         res.send("Gagal Mengambil Data Inventory");
//     }
// });




























// // Jika Peminjaman telah disetujui, Update untuk Mengembalikan Peminjaman / Menyelesaikan Peminjaman
// router.get('/', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { inventoryId, dateEnd, deskripsi, status } = req.body;

//         const updatedPeminjaman = await prisma.peminjaman.update({
//             where: { id_peminjaman: parseInt(id) },
//             data: {
//                 inventoryId,
//                 dateEnd,
//                 deskripsi,
//                 status
//             },
//         });

//         res.status(200).json({ message: 'Peminjaman Selesai', data: updatedPeminjaman });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Gagal Menyelesaikan Peminjaman' });
//     }
// });




// module.exports = router;