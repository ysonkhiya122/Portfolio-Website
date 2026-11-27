const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
/**
 * Renders a YYYY-MM string as "Aug 2025". Written by hand rather than
 * via Intl so the output is identical in every browser and in tests,
 * and so a `null` end date reads as "Present" instead of "Invalid Date".
 */
export function formatMonth(iso) {
    const [year = '', month = ''] = iso.split('-');
    const label = MONTHS[Number(month) - 1];
    // Input is schema-validated to YYYY-MM, so the index is always in
    // range; the fallback exists only for defensive rendering of bad data.
    return label === undefined ? year : `${label} ${year}`;
}
export function formatRange(start, end) {
    return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}
/** Inclusive month count between two YYYY-MM values. */
export function monthsBetween(start, end) {
    const [sy = 0, sm = 1] = start.split('-').map(Number);
    const now = new Date();
    const [ey = now.getFullYear(), em = now.getMonth() + 1] = end
        ? end.split('-').map(Number)
        : [];
    return Math.max(0, (ey - sy) * 12 + (em - sm));
}
export function formatDuration(start, end) {
    const months = monthsBetween(start, end);
    const years = Math.floor(months / 12);
    const rest = months % 12;
    if (years === 0)
        return `${rest} mo`;
    if (rest === 0)
        return `${years} yr`;
    return `${years} yr ${rest} mo`;
}
