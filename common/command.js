import { exec } from 'child_process';

const run = function (commandData, commandRoute, callback) {
    if (!commandData.command || !commandData.expected) {
        return callback({
            ok: false,
            err: `misformatted json for command ${commandRoute}`
        });
    }
    exec(commandData.command, (error, stdout, stderr) => {
        if (stdout.includes(commandData.expected)) {
            return callback({
                ok: true,
                stdout,
                stderr,
            });
        }
        return callback({
            ok: false,
            err: stderr,
        });
    });
}

export default {
    run
}