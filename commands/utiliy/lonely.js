const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	cooldown : 10,
	data: new SlashCommandBuilder()
		.setName('lonely')
		.setDescription('I can help'),
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral});

		const locales = {
			de : 'Du siehst einsam aus. Ich kann das ändern.'
		}
		
		await interaction.editReply({ content: locales[interaction.locale] ?? 'You look lonely, I can fix that.', flags:MessageFlags.Ephemeral });
	},
};