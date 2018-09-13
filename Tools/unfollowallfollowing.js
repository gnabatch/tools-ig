'use strict'

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');

const User = [
{
  type:'input',
  name:'username',
  message:'[>] Tulis Username njuk [ENTER]:',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
  }
},
{
  type:'password',
  name:'password',
  message:'[>] Tulis Password njuk [ENTER]:',
  mask:'*',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
  }
},
{
  type:'input',
  name:'sleep',
  message:'[>] Atur Jeda (MiliSeconds) [misale: 300123] njuk [ENTER]:',
  validate: function(value){
    value = value.match(/[0-9]/);
    if (value) return true;
    return 'Cukup Nggawe Ongko Bosque';
  }
}
]

const Login = async function(User){

  const Device = new Client.Device(User.username);
  const Storage = new Client.CookieMemoryStorage();
  const session = new Client.Session(Device, Storage);

  try {
    await Client.Session.create(Device, Storage, User.username, User.password)
    const account = await session.getAccount();
    return Promise.resolve({session,account});
  } catch (err) {
    return Promise.reject(err);
  }

}

const Unfollow = async function(session, accountId){
  try {
    await Client.Relationship.destroy(session, accountId);
    return chalk`{bold.green SUKSES REK}`;
  } catch (err){
    return chalk`{bold.red GAGAL REK}`;
  }
}

const Excute = async function(User,sleep){

  try {
    console.log(chalk`{yellow [?] Sek Njajal Login . . .}`);
    const doLogin = await Login(User);
    console.log(chalk`{green [!] Alhamdulillaah iso login, }{yellow [?] OTW Unfollow All Following . . .}`)
    const feed = new Client.Feed.AccountFollowing(doLogin.session, doLogin.account.id);
    var cursor;
    do{
      if (cursor) feed.setCursor(cursor);
      var getPollowers = await feed.get();
      getPollowers = _.chunk(getPollowers, 10);
      for (let i = 0; i < getPollowers.length; i++) {
        var timeNow = new Date();
        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
        await Promise.all(getPollowers[i].map(async(account) => {
          const doUnfollow = await Unfollow(doLogin.session, account.id);
          console.log(chalk`[{magenta ${timeNow}}] Unfollow {yellow @${account.params.username}} => ${doUnfollow}`);
        }));
        console.log(chalk`{yellow \n [#][>] Ngaso Sek ${sleep} MiliSeconds [<][#] \n}`);
        await delay(sleep);
      }
      cursor = await feed.getCursor();
    } while(feed.isMoreAvailable())
    console.log(chalk`{bold.green [+] Unfollow Wes Bar}`)
  } catch(e) {
    console.log(e)
  }
}

console.log(chalk`
  {bold.cyan
  —————————————————— [UNFOLLOWING] ————————————————————
{bold.green
  #  ╔╦╗┌─┐┬  ┬┌─  ╦  ┌─┐┌─┐┌─┐  ╔╦╗┌─┐  ╔╦╗┌─┐┬─┐┌─┐
  #   ║ ├─┤│  ├┴┐  ║  ├┤ └─┐└─┐   ║║│ │  ║║║│ │├┬┘├┤ 
  #   ╩ ┴ ┴┴─┘┴ ┴  ╩═╝└─┘└─┘└─┘  ═╩╝└─┘  ╩ ╩└─┘┴└─└─┘}

  —————————————————————————————————————————————————————

}
      `);

inquirer.prompt(User)
.then(answers => {
  Excute({
    username:answers.username,
    password:answers.password
  },answers.sleep);
})
