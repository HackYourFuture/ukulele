import express from 'express'
import bodyParser from 'body-parser'
import childProcess from 'child_process'

const app = express();
const exec = childProcess.exec;

function execCallback(err, stdout, stderr) {
	if(stdout) console.log(stdout);
	if(stderr) console.log(stderr);
}

export default function server(port){

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.sendStatus(200);
	  console.log('get /payload');
  });

  app.post('/', function (req, res) {
	  console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
	  console.log('pulling code from GitHub...');
	  exec(`git -C ${__dirname} reset --hard`, execCallback);
	  exec(`git -C ${__dirname} clean -df`, execCallback);
	  exec(`git -C ${__dirname} pull -f`, execCallback);
	  exec(`npm -C ${__dirname} install`, execCallback);
	  exec(`npm -C ${__dirname} run build`, execCallback);
    res.sendStatus(200);
    res.end();
  });

  app.listen(5000, function () {
	  console.log('listening on port 5000')
  });

}
