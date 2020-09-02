import { createAccount, retrieveSk, getAccount, Secrets, encryptAsset, decryptAsset } from './crypto'


console.log('**** New Account Creation: \n')
let info = createAccount('abcdefg1234') //pk: 592579783F31219A665CFD86BC069BE1B20C35A85E67A5E2C44A30182CFDE954

// console.log('Retrieve private key from mnemonic words: \n')
// retriveSk()
 if (info) {
     console.log('Access to an existent account (the previous one): \n')
     let acc = getAccount(info)
     console.log('Private Key: ' + acc.privateKey)
     console.log('Public Key: ' + acc.publicKey)
     let encr_ass = encryptAsset(acc, 'Residential house: J12')
     let asset = decryptAsset(acc, encr_ass)

 }

//64F3EE66CBD6C39A5EFF4F12EDA7EE49F1549AB695CBB1CEBF890E2D67D7510F17DD97085F2BBB33865BC898EFADB42F