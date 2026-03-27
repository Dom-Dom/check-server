import { createServer } from 'node:http';

import config from './config/config.js';
import command from './common/command.js'

const server = createServer((req, res) => {
    const commands = config.config.commands;
    let commandFound = false;

    for (const commandRoute in commands) {
        let commandData = commands[commandRoute]

        if (req.url === `/${commandRoute}` && req.method === 'GET') {
            commandFound = true;
            command.run(commandData, commandRoute, (result) => {
                console.log(result)
                res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(result);
            });
        }
    }

    if (!commandFound) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                ok: false,
                err: 'Command not found',
            })
        );
    }
});

const port = config.config.port || 81;
server.listen(port, '0.0.0.0', () => {
    console.log(`Listening on 0.0.0.0:${port}`);
});