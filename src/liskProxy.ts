import { Body, BodyParam, JsonController, Post, Put, QueryParam } from 'routing-controllers';
import { LiskWallet, SendTx } from 'dpos-offline';
import * as moment from 'moment';
import { configObj } from './configObj';
import * as is from 'is_js';
import axios from 'axios';

@JsonController('/api')
export class LiskApiProxy {

  @Put('/transactions')
  public async putTransaction(
    @BodyParam('secret') secret: string             = '',
    @BodyParam('amount') amount: number             = -1,
    @BodyParam('recipientId') recipientId: string   = '',
    @BodyParam('secondSecret') secondSecret: string = '',
  ) {
    // Sanity checks
    if (is.any.empty(secret, recipientId)) {
      return {
        success: false,
        error  : 'You must provide all data'
      }
    }
    if (amount < 0) {
      return {
        success: false,
        amount : 'Amount not provided or negative'
      }
    }
    const {data} = await axios.get(`${configObj.broadcastNodeAddress}/api/node/constants`);
    const fee        = parseInt(data.data.fees.send, 10);

    const firstWallet  = new LiskWallet(secret, configObj.addressSuffix);
    const secondWallet = is.empty(secondSecret) ? undefined : new LiskWallet(secondSecret, configObj.addressSuffix);


    const sendTx = new SendTx()
      .withAmount(amount)
      .withFees(fee)
      .withTimestamp(moment.utc().diff(Date.UTC(2016, 4, 24, 17, 0, 0, 0), 'seconds'))
      .withRecipientId(recipientId);

    const broadcastableTransaction = firstWallet
      .signTransaction(
        sendTx,
        secondWallet
      );

    broadcastableTransaction.amount = `${broadcastableTransaction.amount}` as any;
    broadcastableTransaction.fee = `${broadcastableTransaction.fee}` as any;
    try {
      const {status, data: resData} = await axios.post(`${configObj.broadcastNodeAddress}/api/transactions`, broadcastableTransaction);
      if (status === 200) {
        return { success: true, transactionId: broadcastableTransaction.id};
      } else {
        return { success: false, resData };
      }
    } catch (e) {
      return {success: false, error: e.message};
    }

  }

  @Post('/accounts/open')
  public async open(@BodyParam('secret') secret: string = '') {
    const wallet = new LiskWallet(secret, configObj.addressSuffix);
    return {
      success: true,
      account: {
        address  : wallet.address,
        publicKey: wallet.publicKey
      }
    };
  }


  @Post('/accounts/generatePublicKey')
  public async generatePublicKey(@BodyParam('secret') secret: string = '') {
    const wallet = new LiskWallet(secret, configObj.addressSuffix);
    return {
      success: true,
      publicKey: wallet.publicKey
    };
  }

}
