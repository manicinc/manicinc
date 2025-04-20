/**
 * Formats a date input into a string using Intl.DateTimeFormat.
 * Tries to handle various input types (Date object, ISO string, YYYY-MM-DD, timestamp number).
 * NOTE: Parsing non-ISO string formats relies on the environment's `new Date()` behavior,
 * which can be inconsistent. For maximum robustness, use a date library like date-fns.
 *
 * @param input - The date value to format (Date, string, number, undefined, null).
 * @param options - Formatting options. Can be 'long', 'short', or an Intl.DateTimeFormatOptions object. Defaults to 'long'.
 * @param locale - The locale string (e.g., 'en-US', 'en-GB'). Defaults to 'en-US'.
 * @returns The formatted date string, or a fallback string on error/invalid input.
 */
export const formatDate = (
    input: string | number | Date | undefined | null,
    options: 'long' | 'short' | Intl.DateTimeFormatOptions = 'long',
    locale: string = 'en-US'
): string => {
    if (input === null || input === undefined) {
        return 'Date unavailable';
    }

    let date: Date;

    try {
        if (input instanceof Date) {
            // Use Date object directly
            date = input;
        } else if (typeof input === 'number') {
            // Assume Unix timestamp in milliseconds.
            // Add check for seconds if needed (e.g., if input < 1,000,000,000,000)
            date = new Date(input);
        } else if (typeof input === 'string') {
            // Attempt direct parsing (works well for ISO 8601)
            let parsedDate = new Date(input);

            // If direct parsing failed AND it looks like a YYYY-MM-DD string,
            // retry assuming UTC noon to avoid timezone issues with date-only strings.
            if (isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
                parsedDate = new Date(`${input}T12:00:00Z`);
            }
            date = parsedDate;

        } else {
            console.warn("formatDate: Unexpected input type", typeof input, input);
            return 'Invalid Input Type';
        }

        // Final validation after parsing attempts
        if (isNaN(date.getTime())) {
            console.warn("formatDate: Could not parse input into a valid date.", { input });
            // Return the original string if it couldn't be parsed, or a generic message
            return typeof input === 'string' ? `Invalid Date: ${input}` : 'Invalid Date';
        }

        // Determine formatting options
        let formatOptions: Intl.DateTimeFormatOptions;
        const defaultOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC' }; // Default to UTC

        if (typeof options === 'string') {
            if (options === 'long') {
                formatOptions = { ...defaultOptions, dateStyle: 'long' }; // e.g., April 16, 2025
            } else { // 'short'
                formatOptions = { ...defaultOptions, year: 'numeric', month: 'short', day: 'numeric' }; // e.g., Apr 16, 2025
            }
        } else {
            // Merge provided options with UTC default (provided options take precedence)
            formatOptions = { ...defaultOptions, ...options };
        }

        // Format the date
        return new Intl.DateTimeFormat(locale, formatOptions).format(date);

    } catch (error) {
        console.error("formatDate: Error during date processing.", { input, error });
        return 'Formatting Error';
    }
};
