const { cooldown } = require("./confirmLonely");

module.exports = {
  customId: 'cancelLonely',
  async execute(interaction) {
    return await interaction.message.delete();
  },
};