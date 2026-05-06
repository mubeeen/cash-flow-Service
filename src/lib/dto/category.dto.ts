export type CategoryResponse = {
  id: string;
  name: string;
};

export function toCategoryDto(category: { id: string; name: string }): CategoryResponse {
  return { id: category.id, name: category.name };
}
