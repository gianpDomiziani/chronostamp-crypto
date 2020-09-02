import hasha from 'hasha';
import readlineSync from 'readline-sync';
import {
  NetworkType,
  SimpleWallet,
  Password,
  Address,
  Account,
  EncryptedMessage,
  PlainMessage,
  AccountRepository
} from 'symbol-sdk';


let mnGen = require('mngen');


export const NETWORKTYPE = NetworkType.TEST_NET;

export type Secrets = {
  readonly password: Password;
  readonly privateKey: string;
  readonly publicKey: string;
  readonly walletName: string;
  readonly encryptedPrivateKey: string,
  readonly address: Address

};

function sha256(word: string): string {
  return hasha(word, { algorithm: 'sha256', encoding: 'hex' });
}

export function generateMnemonicPrivateKey(): string|void {

  let f: boolean = false
  let privateKey: string = ''

  for (let i=0; i<3; i++) {
    
    const mnemonic: string[] = mnGen.list(4); // [provide,crimson,float,carrot]
    console.log(
      `Write down those mnemonic worlds that are used to generate your private key: \n`
    );
    console.log(`\n${mnemonic}`);
    
    const x = (Math.floor(Math.random()*4) % 3)
    console.log("\nTo be sure you have saved the mnemonic words ...")
    const word1 = readlineSync.question('\nRewrite word number: ' + (x+1) + '\n');
    const word2 = readlineSync.question('\nRewrite word number: ' + (x+2) + '\n');
    if ( word1 === mnemonic[x] && word2 === mnemonic[x+1]) {
      f = true
      let hashes: string[] = [];
      mnemonic.map((world) => {
      hashes.push(sha256(world));
    });
    // Pseudo Merkle Tree
    let tmp_result_1 = sha256(hashes[0] + hashes[1]);
    let tmp_result_2 = sha256(hashes[2] + hashes[3]);

    privateKey = sha256(tmp_result_1 + tmp_result_2);
    console.log("Your private key has been created: " + privateKey)
    break
    }
  }  
  if ( f === true ) {
    return privateKey
  }
  else {
    console.log("Sorry, you've reached the maximum number of attempts.")
  }
 
}

export function createAccount(psw: string ): Secrets|void {
  
  const password = new Password(psw);
  const priv_key = generateMnemonicPrivateKey();
  if ( typeof priv_key == 'string') {
     const walletName = readlineSync.question('\nGive to the wallet a name: ');
     const wallet = SimpleWallet.createFromPrivateKey(
     walletName,
     password,
     priv_key,
     NETWORKTYPE
   );
 
   console.log(`Wallet with address ${wallet.address.pretty()} created.`)
   let acc = wallet.open(password)
   console.log('Public key: '+ acc.publicKey)

   const secret: Secrets = { //save info on secret 
    password: password,
    privateKey: priv_key,
    publicKey: acc.publicKey,
    walletName: walletName,
    encryptedPrivateKey: wallet.encryptedPrivateKey,
    address: wallet.address
  };
  return secret
}
else {
  console.log('Private key creation failed.')
}

} 

export function retrieveSk(): void {
  //Allows to retrieve secret key from mnemonics
  let ls_words: string[] = []
  for ( let i=0; i<4; i++ ) {
    ls_words.push(readlineSync.question(`Write word ${i+1}: `))
  }
  
  let ls_hash: string[] = []
  ls_words.forEach(w => ls_hash.push(sha256(w)))
  const h1 = sha256(ls_hash[0] + ls_hash[1])
  const h2 = sha256(ls_hash[2] + ls_hash[3])
  const sk = sha256(h1 + h2)
  console.log("Here your private key, be sure to save it: " + sk)
}

export function getAccount(info: Secrets): Account {
  let SW = new SimpleWallet(info.walletName, info.address, info.encryptedPrivateKey)
  let acc = SW.open(info.password)
  return acc 
}


export function encryptAsset(account: Account, asset: string): EncryptedMessage {
  console.log('Encrypt asset: ' + asset)
  const ciphertext = account.encryptMessage(asset, account.publicAccount)
  console.log('Encrypted Asset: ' + ciphertext.payload)
  return ciphertext
}

export function decryptAsset(account: Account, asset: EncryptedMessage): PlainMessage {
  const plaintext = account.decryptMessage(asset, account.publicAccount)
  console.log('Decrypted Asset: ' + plaintext.payload)
  return plaintext
}


//export function getPubKeyFromAddress(address: string): string {}

//export function getBalance(account: Account): string {}