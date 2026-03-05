export const resolveStoredUserName = (fallbackUserId: number): string => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return `Pelanggan #${fallbackUserId}`;

  try {
    const parsedUser = JSON.parse(storedUser) as { name?: string };
    return parsedUser.name || `Pelanggan #${fallbackUserId}`;
  } catch {
    return `Pelanggan #${fallbackUserId}`;
  }
};
