const { DateTime } = require('luxon');

function buildTimezoneList() {
    const zones = Intl.supportedValuesOf('timeZone');
    const now = DateTime.utc();

    return zones
        .map(zone => {
            const dt = now.setZone(zone);
            if (!dt.isValid) return null;

            const totalMinutes = dt.offset;
            const sign = totalMinutes >= 0 ? '+' : '-';
            const absMinutes = Math.abs(totalMinutes);
            const hours = Math.floor(absMinutes / 60);
            const minutes = absMinutes % 60;

            const formattedOffset = `(UTC ${sign}${hours}${minutes ? ':' + String(minutes).padStart(2, '0') : ''})`;

            return {
                name: `${zone} ${formattedOffset}`,
                value: zone
            };
        })
        .filter(Boolean);
}

module.exports = { buildTimezoneList };
