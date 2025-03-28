
// Function to get cookie by name
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

// Function to set cookie with expiry days
export function setCookie(name: string, value: string, days: number = 7): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; samesite=lax;';
  
  // Log for debugging
  console.log(`Cookie ${name} set with value ${value.substring(0, 10)}... and expiry ${days} days`);
}

// Function to delete cookie
export function deleteCookie(name: string): void {
  setCookie(name, '', -1);
  console.log(`Cookie ${name} deleted`);
}
