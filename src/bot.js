const { Client, MessageAttachment } = require('discord.js')
const { token, prefix } = require('../config.json')
const bot = new Client();
bot.login(token)
bot.on('ready', () => {
    console.log('Client is ready.')
})
function captchaCreator(min , max)
{
    const captchaChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randCaptchaLength = Math.floor(Math.random() * (max - min + 1)) + min;
    const captcha = Array(randCaptchaLength).fill(captchaChars).map((x) => x[Math.floor(Math.random() * x.length)]).join('');
    return captcha;
}
async function captcha(message) {
    const captcha = captchaCreator(4, 4)
		const captchaImage = `https://ipsumimage.appspot.com/320x100?l=${captcha}`
		message.channel.send(message.author, {
            embed: {
                title: 'Anti-Bot Test.',
                description: 'You have been flagged for Anti-Bot Detection, please complete the following captcha or risk being punished!',
                color: 'FF0000',
                image: {
                    url: captchaImage
                }
            }
        })
       const filter = m => m.author.id === message.author.id
       const collector = message.channel.createMessageCollector(filter, {
           time: 1000 * 30,
           max: 3
       })
       let tries = 3;
       collector.on('collect', (collected) => {
           if (collected.content.toLowerCase() === captcha.toLowerCase()) {
            collector.stop()
               return message.channel.send('Completed Captcha')
           } else{
              --tries
              if (tries === 0) {
                  collector.stop()
                  return message.channel.send('Failed Captcha')
              }
              message.channel.send(`${message.author} Invalid input! You have only have ${tries} ${tries > 1 ? 'tries' : 'try'} left`)
           }
       })
}
bot.on('message', async (message) => {
    const percentage = Math.floor(Math.random() * 100)
    // if (percentage >= 90) {
    //     captcha(message)
    // }
    if(!message.content.startsWith(prefix)) return;
    let [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
    cmd = cmd.toLowerCase()
    if (cmd === 'ping') {
        return message.channel.send(`Ping: ${bot.ws.ping}`)
    }
    if (cmd === 'test') {
       captcha(message)
    }
})