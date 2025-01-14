/**
 * Truncates a string to the specified length and adds ellipsis (...) if necessary.
 * @param {string} str - The string to be truncated.
 * @param {number} length - The length to truncate the string to.
 * @returns {string} - The truncated string with ellipsis if it exceeds the specified length.
 */
export const truncateString = (str: string, length: number): string => {
    if (str.length <= length) {
        return str;
    } else {
        return str.slice(0, length) + '...';
    }
};
