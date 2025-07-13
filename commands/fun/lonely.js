const { SlashCommandBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	cooldown : 60,
	data: new SlashCommandBuilder()
		.setName('lonely')
		.setDescription('I can help')
		.addBooleanOption(option => option.setName("ephemeral").setDescription("Should the loneliness be hidden from others?")),
    
	async execute(interaction) {
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
		if (ephemeral) {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral});
		}
		else {
			await interaction.deferReply()
		}

    const confirm = new ButtonBuilder()
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Success)
      .setCustomId("confirmLonely");

    const cancel = new ButtonBuilder()
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("cancelLonely");

    const row = new ActionRowBuilder()
      .addComponents(confirm, cancel);

    return await interaction.editReply({ content: "Are you sure you want to be fixed?", components: [row] })
		
		await interaction.editReply({ content: locales[interaction.locale] ?? 'You look lonely, I can fix that.' });
	},
};