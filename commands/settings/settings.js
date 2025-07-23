const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const settingsServer = require('./settingsServer');
//const settingsUser = require('./settingsUser');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Bot Settings')
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('Configure the announcer profile')
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Configure personal preferences')
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'server':
                return await settingsServer(interaction);
            //case 'delete':
            //	return await announcementDelete(interaction);
            //case 'edit':
            //	return await announcementEdit(interaction);
            default:
                return await interaction.editReply({ content: 'Unknown subcommand.', flags: MessageFlags.Ephemeral });
        }
    }
};
