const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Client Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({ status: "dnd" })
		client.user.setActivity("you sleep", { type: ActivityType.Watching })
	},
};