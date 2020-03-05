const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"), {
        dotfiles: "allow",
    });
});

module.exports = router;