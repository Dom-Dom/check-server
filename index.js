import { createServer } from 'node:http';
import { exec } from 'child_process';

import config from './config/config.js';

const server = createServer((req, res) => {
    const commands = config.config.commands;
    let commandFound = false;

    for (const commandRoute in commands) {
        let commandData = commands[commandRoute]

        if (req.url === `/${commandRoute}` && req.method === 'GET') {
            commandFound = true;
            if (!commandData.command || !commandData.expected) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(
                    JSON.stringify({
                        ok: false,
                        err: `misformatted json for command ${commandRoute}`
                    })
                );
                return;
            }
            exec(commandData.command, (error, stdout, stderr) => {
                if (stdout.includes(commandData.expected)) {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(
                        JSON.stringify({
                            ok: true,
                            stdout,
                            stderr,
                        })
                    );
                    return;
                }
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(
                    JSON.stringify({
                        ok: false,
                        err: stderr,
                    })
                );
                return;
            });
        }
    }

    if (!commandFound) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }
});

const port = config.config.port || 81;
server.listen(port, '0.0.0.0', () => {
    console.log(`Listening on 0.0.0.0:${port}`);
});