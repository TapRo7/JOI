const fs = require('fs');
const { DateTime } = require('luxon');

const zones = Intl.supportedValuesOf('timeZone');

const now = DateTime.utc();

const timezones = zones
    .map(zone => {
        const dt = now.setZone(zone);
        if (!dt.isValid) return null;

        const offset = dt.offset / 60;
        const hours = Math.floor(offset);
        const minutes = Math.abs(offset % 1) * 60;

        const sign = offset >= 0 ? '+' : '-';
        const formattedOffset = `(UTC ${sign}${Math.abs(hours)}${minutes ? ':' + String(minutes).padStart(2, '0') : ''})`;

        return {
            name: `${zone} ${formattedOffset}`,
            value: zone
        };
    })
    .filter(Boolean);

fs.writeFileSync('./timezones.json', JSON.stringify(timezones, null, 2));
console.log(`Generated ${timezones.length} timezones`);