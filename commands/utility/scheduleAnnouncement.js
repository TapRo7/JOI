const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { v4: uuidv4 } = require('uuid');

module.exports = {
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('schedule-announcement')
		.setDescription('Schedule an Announcement for later!')
		.addAttachmentOption(option => option.setName("file_1").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_2").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_3").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_4").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_5").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_6").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_7").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_8").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_9").setDescription("Attach a file"))
		.addAttachmentOption(option => option.setName("file_10").setDescription("Attach a file")),

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const attachments = [];
		for (let i = 1; i <= 10; i++) {
			const file = interaction.options.getAttachment(`file_${i}`);
			if (file) attachments.push(file);
		}

		if (attachments.length !== 0) {
			const uniqueId = uuidv4();
			const baseDir = path.join(__dirname, 'Attachments', uniqueId);
			fs.mkdirSync(baseDir, { recursive: true });

			try {
				for (const attachment of attachments) {
				const fileUrl = attachment.url;
				const fileName = attachment.name;
				const savePath = path.join(baseDir, fileName);

				const response = await fetch(fileUrl);
				if (!response.ok) throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);

				const fileStream = fs.createWriteStream(savePath);
				await pipeline(response.body, fileStream);
				}
			} catch (err) {
				console.error(err);
				return await interaction.editReply('❌ Failed to save one or more files.');
			}
	    }
    }
};
