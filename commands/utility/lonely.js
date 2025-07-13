const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const locales = {
  de: "Du siehst einsam aus. Ich kann das ändern.",
  fr: "Tu as l'air seul, je peux arranger ça.",
  es: "Pareces estar solo. Puedo arreglar eso.",
  it: "Sembri solo. Posso sistemarlo.",
  pt: "Você parece sozinho. Eu posso consertar isso.",
  ru: "Ты выглядишь одиноко. Я могу это исправить.",
  zh: "你看起来很孤独，我可以帮你改变这一点。",
  ja: "寂しそうね。私が変えてあげる。",
  ko: "외로워 보이네. 내가 고쳐줄게.",
  ar: "تبدو وحيدًا، يمكنني إصلاح ذلك.",
  tr: "Yalnız görünüyorsun. Bunu düzeltebilirim.",
  pl: "Wyglądasz na samotnego. Mogę to naprawić.",
  nl: "Je ziet er eenzaam uit. Ik kan dat veranderen.",
  sv: "Du ser ensam ut. Jag kan fixa det.",
  fi: "Näytät yksinäiseltä. Voin korjata sen.",
  no: "Du ser ensom ut. Jeg kan fikse det.",
  da: "Du ser ensom ud. Jeg kan ordne det.",
  ro: "Păreți singur. Pot rezolva asta.",
  cs: "Vypadáš osaměle. Můžu to změnit.",
  el: "Φαίνεσαι μόνος. Μπορώ να το αλλάξω.",
  he: "את נראית בודדה, אני יכולה לתקן את זה.",
  hu: "Magányosnak tűnsz. Ezen tudok segíteni.",
  uk: "Ти виглядаєш самотньо. Я можу це змінити.",
  th: "คุณดูเหงา ฉันช่วยคุณได้นะ",
  vi: "Bạn trông cô đơn. Tôi có thể thay đổi điều đó.",
  id: "Kamu terlihat kesepian. Aku bisa memperbaikinya.",
  ms: "Kamu nampak sunyi. Saya boleh bantu ubahnya.",
  fa: "تنها به نظر می‌رسی. می‌توانم این را تغییر دهم.",
  ur: "تم تنہا لگ رہی ہو، میں اسے ٹھیک کر سکتی ہوں."
};

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
		
		await interaction.editReply({ content: locales[interaction.locale] ?? 'You look lonely, I can fix that.' });
	},
};