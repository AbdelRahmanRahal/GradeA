// Email validation function
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


//For now this is redundant because I am not utilizing it.. for now.. perhaps one day, dear reader. <3
// // Password validation function
// export function validatePassword(password) {
//     // Example rule: At least 8 characters, one uppercase, one lowercase, one number, and one special character
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
// }