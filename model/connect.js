const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/instagram')
.then(() => console.log('databe connected'))
.catch(err => console.log(err))