let FilesProcess = require('../obj/src/container/FilesProcess').FilesProcess;

try {
    new FilesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
