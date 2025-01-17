export const GetAvatarFromName = (firstName?: string, lastName?: string) => {
    if (!firstName) return "U"; // Default to "U" for userArray if no name is provided
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    
    return `${firstInitial}${lastInitial}`;
  };



  export function formatMongoDate(createdAt:string|undefined) {
    if (!createdAt) return null; // Handle invalid input gracefully

    const date = new Date(createdAt); 
    const day = date.getDate().toString().padStart(2, '0');   // Ensures two-digit day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

