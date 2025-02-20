export class GetPropertyQueryDto {
  search?: string; // Search term for property name or description
  property_type?: string; // Filter by property type (e.g., Residential, Commercial)
  city?: string; // Filter by city
  state?: string; // Filter by state
  zip_code?: string; // Filter by postal code
  priceMin?: number; // Minimum price filter
  priceMax?: number; // Maximum price filter
  availability?: boolean; // Filter by availability status
}
