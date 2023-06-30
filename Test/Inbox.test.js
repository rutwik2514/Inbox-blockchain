const assert = require('assert');
const ganache = require('ganache-cli');
const Web3=require('web3');
const {interface,bytecode} = require('../compile')

//ganache used to connect to local network
// const web3 = new Web3(ganache.provider());
const web3 = new Web3(ganache.provider());
const INITIAL_MESSAGE = 'Hi there!'
let accounts;
let inboxContract;


beforeEach(async()=>{
   accounts = await web3.eth.getAccounts()
   inboxContract = await new web3.eth.Contract(JSON.parse(interface))
   .deploy({data:bytecode, arguments: [INITIAL_MESSAGE]})
   .send({from:accounts[0], gas:'1000000'})
})

describe('Inbox',()=>{
    it('deploys a contract', ()=>{
        // console.log(inboxContract);
        assert.ok(inboxContract.options.address)
    })

    it('has a message', async ()=>{
        const message=await inboxContract.methods.message().call();
        assert.equal(message,INITIAL_MESSAGE)
    })
    it('can change the message', async ()=>{
       await inboxContract.methods.setMessage('bye').send({from:accounts[0]});
       //after sending, its not like calling function where we get back message
       //in send(),we get a transaction hash and not message
       //so we does not store it in anything, if setMessage is not working then line 35 will give error automatically
       const message=await inboxContract.methods.message().call();
       assert.equal(message,'bye');
    })
})