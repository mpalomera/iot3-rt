var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot2023-5d518-default-rtdb.firebaseio.com"
});

const db = admin.database();

const { Router, app } = require('express');
const router = Router();

router.get('/', (req, res) => {
    db.ref('contacts').once('value', (snapshot) => {
        data = snapshot.val();
        res.render('index', { contacts: data })
    });
})

router.post('/new-contact', (req, res) => {
    const newContact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone
    }
    db.ref('contacts').push(newContact);
    res.redirect('/');
});

router.get('/delete-contact/:id', (req, res) => {
    db.ref('contacts/' + req.params.id).remove();
    res.redirect('/');
});
// Esta es la parte que envia los datos a los clientes
setInterval(() => {
    aWss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);
// Deberian probar cambiarla a algo como
/*
db.ref('contacts').on('value', (snapshot) => {
    data = snapshot.val();
    aWss.clients.forEach((client) => {
        client.send(data);
    })
});
*/
module.exports = router;