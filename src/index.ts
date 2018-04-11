import * as bodyParser from 'body-parser';
import * as express from 'express';
import 'reflect-metadata';
import * as is from 'is_js';
import * as httpProxy from 'http-proxy-middleware';
import { configObj } from './configObj';

import { createExpressServer, useExpressServer } from 'routing-controllers';
import { ApiProxy } from './proxy';
import * as commander from 'commander';

const startCommand = commander.command('start')
  .option('-s, --suffix <suffix>', 'Address Suffix (R for Rise)', 'R')
  .option('-n, --node <node>', 'Original node address to broadcast transactions to', '')
  .action((args) => {
    if (is.empty(args.node)) {
      startCommand.outputHelp();
      process.exit(1);
    }
    const suffix = args.suffix.toUpperCase().trim();
    let node = args.node.trim();
    if (node.endsWith('/')) {
      node = node.substr(0, node.length-1);
    }

    configObj.broadcastNodeAddress = node;
    configObj.addressSuffix = suffix;

    // Starting server
    const app = express();
    app.use(bodyParser.urlencoded({extended: true, limit: '2mb', parameterLimit: 5000}))

    useExpressServer(app, {
      controllers: [ApiProxy],
    });

    app.use(httpProxy({ target: configObj.broadcastNodeAddress, changeOrigin: true }));

    app.listen(6990, () => {
      console.log('Listening and proxying.');
    });
  });

commander.on('*', function () {
  startCommand.outputHelp()
});
commander.parse(process.argv);

if (commander.args.length < 1) {
  startCommand.outputHelp()
}



