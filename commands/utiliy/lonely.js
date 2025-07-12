const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	cooldown : 10,
	data: new SlashCommandBuilder()
		.setName('lonely')
		.setDescription('I can help'),
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral});
		await interaction.editReply({ content: 'You look lonely, I can fix that.', flags:MessageFlags.Ephemeral });
	},
};