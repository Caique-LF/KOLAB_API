export function excludePassword(user: any): any {
  const { password, parentUserId, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    parentUserId: parentUserId && parentUserId.id ? parentUserId.id : null,
  };
}
