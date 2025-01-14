export const GetAvatarFromName = (firstName?: string, lastName?: string) => {
    if (!firstName) return "U"; // Default to "U" for userArray if no name is provided
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    
    return `${firstInitial}${lastInitial}`;
  };