const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const announcementSchedule = require('./announcementSchedule');
//const announcementDelete = require('./announcementDelete');
//const announcementEdit = require('./announcementEdit');

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('announcement')
		.setDescription('Manage scheduled announcements')
		.addSubcommand(subcommand => subcommand
			.setName('schedule')
			.setDescription('Schedule an announcement')
			.addStringOption(
				option => option
					.setName('name')
					.setDescription('Set a unique name for the announcement')
					.setMaxLength(50)
					.setRequired(true)
			)
		)
		.addSubcommand(subcommand => subcommand
			.setName('delete')
			.setDescription('Delete a scheduled announcement')
		)
		.addSubcommand(subcommand => subcommand
			.setName('edit')
			.setDescription('Edit a scheduled announcement')
		),

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const sub = interaction.options.getSubcommand();

		switch (sub) {
			case 'schedule':
				return await announcementSchedule(interaction);
			//case 'delete':
			//	return await announcementDelete(interaction);
			//case 'edit':
			//	return await announcementEdit(interaction);
			default:
				return await interaction.editReply({ content: 'Unknown subcommand.', flags: MessageFlags.Ephemeral });
		}
	}
};
