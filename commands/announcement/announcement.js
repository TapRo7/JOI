const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const announcementSchedule = require('./schedule');
//const announcementDelete = require('./announcement/delete');
//const announcementEdit = require('./announcement/edit');

module.exports = {
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('announcement')
		.setDescription('Manage scheduled announcements')
		.addSubcommand(subcommand => subcommand
			.setName('schedule')
			.setDescription('Schedule an announcement')
			.addAttachmentOption(option => option.setName("file_1").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_2").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_3").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_4").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_5").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_6").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_7").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_8").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_9").setDescription("Attach a file"))
			.addAttachmentOption(option => option.setName("file_10").setDescription("Attach a file"))
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
