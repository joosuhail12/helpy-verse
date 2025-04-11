/**
 * Extract username from an email address
 * @param email - The email address to extract username from
 * @returns The username portion of the email
 */
export const extractUsernameFromEmail = (email: string): string => {
    // Check if it's an email
    if (!email || !email.includes('@')) return email;

    // Extract the part before @ symbol
    const username = email.split('@')[0];

    // Capitalize first letter and replace dots/underscores with spaces
    return username
        .replace(/\./g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

/**
 * Get user initials from a name or email
 * @param nameOrEmail - The user's name or email
 * @returns Up to 2 letters representing the user's initials
 */
export const getUserInitials = (nameOrEmail: string): string => {
    if (!nameOrEmail) return '?';

    // If it's an email, get the username part first
    const name = nameOrEmail.includes('@')
        ? extractUsernameFromEmail(nameOrEmail)
        : nameOrEmail;

    // Split name by spaces
    const parts = name.split(/\s+/);

    if (parts.length === 1) {
        // If only one part, return first letter (capitalized)
        return parts[0].charAt(0).toUpperCase();
    } else {
        // Return first letter of first part and first letter of last part
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
}; 