# dPoS API Fallback

Easy peasy micro-server to add support to deprecated API methods.

Currently supported deprecated methods:

 - RISE: /api/transactions [PUT] used in most pool systems.
 - RISE: /api/accounts/open [POST] offline creates a new account from given secret.
 - RISE: /api/accounts/generatePublicKey [POST] offline creates a new account from given secret. Returns publicKey.

## Prerequisites:

Have nodejs (v6 or superior) installed


## Installation:

```
git clone https://github.com/vekexasia/dpos-api-fallback.git
cd dpos-api-fallback
npm i
npm run package
```


## Usage:
```
  Usage: start [options]

  Options:

    -s, --suffix <suffix>  Address Suffix (R for Rise) (default: R)
    -p, --port <port>      Proxy port (default: 6990)
    -n, --node <node>      Original node address to broadcast transactions to (default: )
    -h, --help             output usage information

```


## Example

Example usage with official node wallet.

```
npm start -- -n https://wallet.rise.vision -s R

```


## Ok What now in dakk pool script?

Set your node server to `http://localhost:6990` and launch this with the command shown above before launching dakk script.


## LICENSE

Copyright (c) 2018 Andrea

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.