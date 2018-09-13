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
  name:'mysyntx',
  message:'[>] Meh Mbusek Piro? [misale: 100] njuk [ENTER]:',
  validate: function(value){
    value = value.match(/[0-9]/);
    if (value) return true;
    return 'Cukup Nggawe Ongko Bosque';
  }
},
{
	type:'input',
	name:'sleep',
	message:'[>] Insert Sleep (MiliSeconds):',
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

const Media = async function(session, id){
	const Media = new Client.Feed.UserMedia(session, id);

	try {
		const Poto = [];
		var cursor;
		do {
			if (cursor) Media.setCursor(cursor);
			const getPoto = await Media.get();
			await Promise.all(getPoto.map(async(poto) => {
				Poto.push({
					id:poto.id,
					link:poto.params.webLink
				});
			}))
			cursor = await Media.getCursor()
		} while (Media.isMoreAvailable());
		return Promise.resolve(Poto);
	} catch (err){
		return Promise.reject(err);
	}
}

const Delete = async function(session, id){
	try {
		await Client.Media.delete(session,id);
		return true;
	} catch (err) {
		return false;
	}
}


const Excute = async function(User,sleep,mysyntx){
	try {
		
		/** TRY TO LOGIN **/
		console.log('\n [?] Sek Njajal Login . . .');
		const doLogin = await Login(User);
		console.log(chalk`{bold.green [!] Alhamdulillaah iso login..}`);

		/** TRY TO GET ALL MEDIA **/		
		console.log('[?]  . . .')
		var getMedia = await Media(doLogin.session, doLogin.account.id);
		console.log(chalk`{bold.green [!] OTW Mbusek. Media Length : ${getMedia.length}}\n`);
		getMedia = _.chunk(getMedia, mysyntx);

		/** TRY TO DELETE ALL MEDIA **/
		for (let i = 0; i < getMedia.length; i++) {
			console.log('[?] Try to Delete Photo/Delay \n')
			await Promise.all(getMedia[i].map(async(media) => {
				const doDelete = await Delete(doLogin.session, media.id);
				const PrintOut = chalk`> ${media.link} => ${doDelete ? chalk`{bold.green SUKSES REK}` : chalk`{bold.red GAGAL REK}`}`
				console.log(PrintOut);
			}))
			console.log(chalk`{yellow \n [#][>] Ngaso Sek ${sleep} MiliSeconds [<][#] \n}`)
			await delay(sleep)
		}

	} catch (err) {
		console.log(err);
	}
}
console.log(chalk`
  {bold.cyan
  —————————————————— [INFORMATION] ———————————————————
{bold.green
  #  ╔╦╗┌─┐┬  ┬┌─  ╦  ┌─┐┌─┐┌─┐  ╔╦╗┌─┐  ╔╦╗┌─┐┬─┐┌─┐
  #   ║ ├─┤│  ├┴┐  ║  ├┤ └─┐└─┐   ║║│ │  ║║║│ │├┬┘├┤ 
  #   ╩ ┴ ┴┴─┘┴ ┴  ╩═╝└─┘└─┘└─┘  ═╩╝└─┘  ╩ ╩└─┘┴└─└─┘}

  ————————————————————————————————————————————————————

}
      `);

inquirer.prompt(User)
.then(answers => {
	Excute({
		username:answers.username,
		password:answers.password
	},answers.sleep,answers.mysyntx);
})
