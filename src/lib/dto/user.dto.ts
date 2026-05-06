// NEVER expose password — this is why DTOs exist

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export function toUserDto(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
