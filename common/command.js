import { exec } from 'child_process';

const run = function (commandData, commandRoute, callback) {
    if (!commandData.command || !commandData.expected) {
        return callback(JSON.stringify({
            ok: false,
            err: `misformatted json for command ${commandRoute}`
        }));
    }
    exec(commandData.command, (error, stdout, stderr) => {
        if (stdout.includes(commandData.expected)) {
            return callback(JSON.stringify({
                ok: true,
                stdout,
                stderr,
            }));
        }
        return callback(JSON.stringify({
            ok: false,
            err: stderr,
        }));
    });
}

export default {
    run
}