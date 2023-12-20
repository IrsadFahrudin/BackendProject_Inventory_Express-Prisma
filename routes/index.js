var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;


// router.post('/logout', async (req, res) => {
//   try {
//       // Verifikasi token dan mendapatkan payload
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//       // Perbarui role pada payload sebagai tanda bahwa pengguna telah logout
//       const updatedToken = jwt.sign({ ...decoded, role: 'logout' }, process.env.JWT_SECRET);
  
//       req.user = decoded; // Menetapkan req.user dengan payload token
  
//       next();
//     } catch (error) {
//       console.error(error);
  
//       // Tambahkan penanganan kesalahan di sini jika diperlukan
  
//       // Contoh: Menetapkan req.user dengan nilai yang sesuai jika token tidak valid
//       req.user = { role: 'guest' };
  
//       res.status(401).json({ error: 'Invalid or expired token' });
//     }
// });
