const createError = require('http-errors');
const { Router } = require('express');
const Lobby = require('../classes/Lobby');
const { getGuildCount, getGuildList } = require('../discord-bot/discord-bot');
const { version = 'Unreleased' } = require('../package.json');

// Initialize the server
const router = Router();

router.get(['/', '/server'], (req, res, next) => {
    Promise.all([getGuildCount(), Lobby.getLobbyCount()])
        .then(([guildsSupported, lobbiesInProgress]) => {
            res.json({ version, guildsSupported, lobbiesInProgress })
        })
        .catch(error => next(error));
});

router.get('/server/guilds', (req, res, next) => {
    getGuildList()
        .then(list => res.json(list))
        .catch(error => next(error));
})

router.get('/server/lobbies', (req, res, next) => {
    Lobby.getLobbyList()
        .then(list => res.json(list))
        .catch(error => next(error));
})

router.use((req, res, next) => {
    next(createError(404, "No such API endpoint."));
});

router.use((error, req, res, next) => {
    if (!createError.isHttpError(error)) error = createError(error);
    console.error(error);
    res.status(error.status).json(error);
});

module.exports = router;