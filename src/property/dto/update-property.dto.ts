import { PropertyType } from 'src/shared/schema/property';

export interface UpdatePropertyDto {
  propertyName: string;
  description: string;
  property_type: PropertyType;

  location: {
    address: string; // Full address
    city: string; // City
    state: string; // State/Region
    zip_code: string; // Postal code
    latitude: number; // Latitude for mapping
    longitude: number; // Longitude for mapping
  };

  price: number; // Listing price

  size: {
    area: number; // Area in square feet/meters
    bedrooms: number; // Number of bedrooms
    bathrooms: number; // Number of bathrooms
  };

  amenities: string[]; // Array of amenities
  propertyImage: string[]; // Array of image URLs
  videos: string[]; // Array of video URLs
  virtual_tour?: string; // URL for 360-degree virtual tour

  availability?: boolean; // Availability status
  agent_id: string; // Reference to the agent managing the listing
  property_status: string; // Status (e.g., for sale, for rent)
}
