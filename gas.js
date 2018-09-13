'use strict'

//const insta = require('./func.js');
const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');
//const Spinner = require('cli-spinner').Spinner;

const questionTools = [
  {
    type:"list",
    name:"Tools",
    message:"Daftar Tools:",
    choices:
      [
        "[1] Auto Follow",
        "[2] Auto Unfollow",
        "[3] Hapus Semua Konten",
        "\n"
      ]
  }
]

const main = async () => {
  var spinner;
  try{
    var toolChoise = await inquirer.prompt(questionTools);
    toolChoise = toolChoise.Tools;
    switch(toolChoise){
      case "[1] Auto Follow":
        const followfollowerstarget = require('./Tools/followfollowerstarget.js');
        await followfollowerstarget();
        break;


		case "[2] Auto Unfollow":
        const unfollowallfollowing = require('./Tools/unfollowallfollowing.js');
        await unfollowallfollowing();
        break;

		case "[3] Hapus Semua Konten":
        const deleteallmedia = require('./Tools/deleteallmedia.js');
        await deleteallmedia();
        break;

		default:
        console.log('\nERROR:\n[?] Aw, Snap! \n[!] Something went wrong while displaying this program!\n[!] Please try again!');
    }
  } catch(e) {
    //spinner.stop(true);
    //console.log(e);
  }
}

console.log(chalk`
  {bold.magenta

          {bold.red      $IIIIIIIIIIIIIIIIIIII77I777777.               
          .Z77I7I7IIIIII??IIIIIIIIIIII777777777...          
         .$77777I7IIIIIIII?IIIIIIIIIIIII777777777.          
       .:$7$77777..                     ..77777777.         
       .$$$$$77..  ......................  .7777777.        
      .$$$$$$.   77777IIIIIIII?IIIIIIIIIII. ..I7777Z        
       $$$$$. .Z$7777777IIIIIII?IIIIIIIIIIII...I7777        
      .Z$Z$$. ~$$$77777777IIIIII?III??~  IIII. .I777 }       
      .ZZZZ.  $$$$777777777IIIIIIIII??. .7III. .7777        
      .ZZZZ. .$$$$$$777777$.... .IIIIIIIIIIII. .I777        
      .ZZZZ. .Z$$$$$$$$7..        ..II??I?III. .IIII        
      .$$ZZ. .ZZ$$$$$$... 7777I7I.  .II??IIII. .IIII        
      .$$ZZ. .ZZZ$$$$.  $$7777777II.. III??II. .IIII        
      .$$$Z.  ZZZZZZI .$$$$777777777  .III?II. .IIII        
       7$$$. .ZZZZZ$. .$$$$$$7777777$. IIII??. .IIII        
       77$$.  ZZZZZZ. .$$$$$$7777777I. 7IIIII. .?III        
      .7777. .$ZZZZZ. .$$$$$$$$7$777+. 7IIIII. .IIII        
      .I777. .$$$$ZZZ. .Z$$$$$$$7$77. .7IIIII. .???I        
      .I777  .$$$$ZZZ.. .ZZ$$$$$$$7  .777IIII. .III?        
      .III7. .7$$$$$ZZZ.. .Z$$$$.. ..7777777I. .IIII        
      .?III. .777$$$$$ZZ?.        .$$$7777777. .IIII        
      .?IIII. I777$$$$$ZZZZZZ$OZ$$$$$$$$77777. .IIII        
      .????I...77777$$$$$ZZZZZZ$Z$$$$$$$$$77.. I77II        
      .?????I. .?7777$$$$$ZZZZZZZZZ$$$$$$$7 ..77777?        
       .?????I.   .7777$$$$$ZZZZZZZZ$$$$.. ..777777.        
       ..??????I..                       ..$$$$777.         
         .???????IIIII777777$$$$$ZZZZZ$$Z$$$$$$77.          
          .,??????IIIII77777$$$$$ZZZZZZZZ$$$$$$.            
              ,????IIIII777777$$$$ZZZZZZZZ$$.               
                                                            
                                                            
              {yellow "-Keep Working While Sleeping-"}

                                            {bold.cyan .BadBoy}  

    —————————————————— [ ATTENTION! ] ———————————————————
    
    {cyan NOTICE : Demi Kenyamanan Bersama - 
             Dilarang "mempublish/show off" dg 
             mengatasnamakan tools ini, apapun
             alasannya.

             DIEM-DIEM BAE, GAK PERLU KOAR-KOAR! }

    —————————————————————————————————————————————————————                                                                 

    —————————————————— [INFORMATION] ————————————————————

    [!] {bold.green Not For Commercial Use!}
    [!] {bold.green Jangan Maruk, Nanti di ban!}
    [!] {bold.green Ojo Lali Nonton Drakor :v}

    —————————————————————————————————————————————————————
    {bold.red Source: CSC (ccocot@bcode.net)}

}
      `);

main()
