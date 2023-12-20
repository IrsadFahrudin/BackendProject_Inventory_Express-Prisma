const { PrismaClient } = require("@prisma/client");
var express = require('express');
var router = express.Router();

const prisma = new PrismaClient();

// Test getData untuk mengecek server sudah terhubung
router.get("/", async (req, res) => {
    try {
        const user = await prisma.inventory.findMany();
        res.send(user);
    } catch (err) {
        res.send("Gagal Mengambil Data Inventory");
    }
});


router.post('/', async (req, res) => {
    const { nama, gambar, deskripsi, kategori, status } = req.body;

    try {
        const newInventory = await prisma.inventory.create({
            data: {
                // Field yang harus diisi untuk Menambahkan barang di Inventory
                nama,
                gambar, // Bisa tidak digunakan jika tidak diperlukan
                deskripsi,
                kategori,
                status
            },
        });
        res.status(200).json({ msg: "Pembuatan Inventory Berhasil" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Inventory Gagal Dibuat' });
    }
});

// Update Inventory
router.put("/:id", async (req, res) => {
    try {
        // Update berdasarkan Id_Iventory
        const { id } = req.params;
        const { nama, gambar, deskripsi, kategori, status } = req.body;

        const updateInventory = await prisma.inventory.update({
            where: { id_inventory: parseInt(id) },
            data: { nama, gambar, deskripsi, kategori, status },
        });
        
        res.status(200).json({ msg: "Update Inventory Berhasil" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Inventory Gagal Diupdate' });
    }
});

// Delete Inventory
router.delete("/:id", async (req, res) => {
    try {
        // Delete berdasarkan Id
        const { id } = req.params;

        const deleteInventory = await prisma.inventory.delete({
            where: { id_inventory: parseInt(id) },
        });

        res.status(200).json({ msg: "Delete Inventory Berhasil" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Inventory Gagal Didelete' });
    }
});


module.exports = router;