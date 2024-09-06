import TelegramApi from 'node-telegram-bot-api'
import { gameOptions, againOptions } from './options.js'

const token = `7368920589:AAFWALVR4ZK62BMhG0Puy8CgQdD4SoZOOVo`
const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async chatId => {
	await bot.sendMessage(
		chatId,
		'Я сейчас загадываю цифру от 0 до 9, а ты попробуй ее отгадать!',
	)
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Приветствие.' },
		{ command: '/info', description: 'Информация о пользователе.' },
		{ command: '/game', description: 'Игра в угадай число.' },
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id

		console.log(text)
		if (text === '/start') {
			return bot.sendMessage(chatId, 'Добро пожаловать!')
		}

		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
		}

		if (text === '/game') {
			return startGame(chatId)
		}

		return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		if (data === '/again') {
			return startGame(chatId)
		}
		if (data == chats[chatId]) {
			return bot.sendMessage(
				chatId,
				`Поздравляю, ты отгдал число ${data}`,
				againOptions,
			)
		} else {
			return bot.sendMessage(
				chatId,
				`К сожалению ты не угадал, бот загадал число ${chats[chatId]}`,
				againOptions,
			)
		}
	})
}

start()
