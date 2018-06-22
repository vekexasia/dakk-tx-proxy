import { Body, BodyParam, JsonController, Post, Put, QueryParam } from 'routing-controllers';
import { LiskWallet, SendTx } from 'dpos-offline';
import * as moment from 'moment';
import { configObj } from './configObj';
import { dposAPI, APIWrapper } from 'dpos-api-wrapper';
import * as is from 'is_js';

@JsonController('/api')
export class ApiProxy {
  private dposAPI: APIWrapper = dposAPI.newWrapper(configObj.broadcastNodeAddress);


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


    const {fee}        = await this.dposAPI.blocks.getFee();
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
    const transport                = await this.dposAPI.buildTransport();
    const res = await transport.postTransaction(broadcastableTransaction);
    return {... res, transactionId: broadcastableTransaction.id};
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
