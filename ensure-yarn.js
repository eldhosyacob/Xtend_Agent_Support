const isYarn = process.env.npm_execpath && process.env.npm_execpath.includes('yarn');


if (!isYarn) {
 console.error('Error: Please use Yarn to run commands in this project.');
 process.exit(1);
}
