const { PrismaClient } = require("@prisma/client");
var express = require('express');
var router = express.Router();

const prisma = new PrismaClient();


router.get("/", async (req, res) => {
  try {
    const user = await prisma.akun.findMany();
    res.send(user);
  } catch (err) {
    res.send("Gagal Mengambil Data User");
  }
});


module.exports = router;




// router.post("/", async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     const user = await prisma.user.create({
//       data: {
//         username,
//         password,
//         role,
//       },
//     });
//     res.send({
//       status: true,
//       message: "Data Created",
//       data: user,
//     });
//   } catch (err) {
//     res.send({
//       status: false,
//       err: "Gagal Membuat Data Employee Baru!",
//     });
//   }
// });