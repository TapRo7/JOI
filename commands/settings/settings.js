const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const settingsServer = require('./settingsServer');
const settingsUser = require('./settingsUser');

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Bot Settings')
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('Configure the announcer profile')
            .addStringOption(option => option.setName('announcer_name').setDescription('Enter the name the announcement bot should have').setRequired(true))
            .addAttachmentOption(option => option.setName('announcer_profile').setDescription('Attach the profile picture the announcement bot should have').setRequired(true))
            .addChannelOption(option => option.setName('error_channel').setDescription('Please select a channel where errors with scheduled announcements will be sent').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Configure personal preferences')
            .addStringOption(option => option.setName('timezone').setDescription('Please select your preferred timezone to schedule announcements in').setAutocomplete(true).setRequired(true))
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = interaction.client.timezones;

        const filtered = choices
            .filter(choice => choice.name.toLowerCase().includes(focusedValue))
            .slice(0, 25);

        await interaction.respond(filtered);
    },

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'server':
                return await settingsServer(interaction);
            case 'user':
                return await settingsUser(interaction);
            default:
                return await interaction.editReply({ content: 'Unknown subcommand.', flags: MessageFlags.Ephemeral });
        }
    }
};
