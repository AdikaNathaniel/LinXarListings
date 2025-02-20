import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PropertyRepository } from 'src/shared/repositories/property.repository';
import { Property } from 'src/shared/schema/property';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetPropertyQueryDto } from './dto/get-property-query-dto';
import qs2m from 'qs-to-mongo';
import cloudinary from 'cloudinary';
import config from 'config';
import { unlinkSync } from 'fs';
import { OrdersRepository } from 'src/shared/repositories/order.repository';

@Injectable()
export class PropertyService {
  constructor(
    @Inject(PropertyRepository) private readonly propertyDB: PropertyRepository,
    @Inject(OrdersRepository) private readonly orderDB: OrdersRepository,
  ) {
    cloudinary.v2.config({
      cloud_name: config.get('cloudinary.cloud_name'),
      api_key: config.get('cloudinary.api_key'),
      api_secret: config.get('cloudinary.api_secret'),
    });
  }

  async createProperty(createPropertyDto: CreatePropertyDto): Promise<{
    message: string;
    result: Property;
    success: boolean;
  }> {
    try {
      const createdPropertyInDB = await this.propertyDB.create(createPropertyDto);
      return {
        message: 'Property created successfully',
        result: createdPropertyInDB,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllProperties(query: GetPropertyQueryDto) {
    try {
      const { criteria, options, links } = qs2m(query);

      const { totalPropertyCount, properties } = await this.propertyDB.find(
        criteria,
        options,
      );

      const skip = options.skip || 0;
      const limit = options.limit || 12;
      const pages = limit > 0 ? Math.ceil(totalPropertyCount / limit) : 1;

      return {
        message:
          properties.length > 0
            ? 'Properties fetched successfully'
            : 'No properties found',
        result: {
          metadata: {
            skip,
            limit,
            total: totalPropertyCount,
            pages,
            links: links('/', totalPropertyCount),
          },
          properties,
        },
        success: true,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch properties');
    }
  }

  async findOneProperty(id: string): Promise<{
    message: string;
    result: Property;
    success: boolean;
  }> {
    try {
      const property = await this.propertyDB.findOne({ _id: id });
      if (!property) {
        throw new BadRequestException('Property does not exist');
      }
      return {
        message: 'Property fetched successfully',
        result: property,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<{
    message: string;
    result: Property;
    success: boolean;
  }> {
    try {
      const propertyExist = await this.propertyDB.findOne({ _id: id });
      if (!propertyExist) {
        throw new BadRequestException('Property does not exist');
      }
      const updatedProperty = await this.propertyDB.findOneAndUpdate(
        { _id: id },
        updatePropertyDto,
      );

      return {
        message: 'Property updated successfully',
        result: updatedProperty,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removePropertyByName(propertyName: string): Promise<{
    message: string;
    success: boolean;
    result: null;
  }> {
    try {
      const propertyExist = await this.propertyDB.findOne({ propertyName });
      if (!propertyExist) {
        throw new BadRequestException('Property does not exist');
      }
      await this.propertyDB.findOneAndDelete({ propertyName });
      return {
        message: 'Property deleted successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadPropertyImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<{
    message: string;
    success: boolean;
    result: string;
  }> {
    try {
      const property = await this.propertyDB.findOne({ _id: id });
      if (!property) {
        throw new BadRequestException('Property does not exist');
      }

      // if (property.imageDetails?.public_id) {
      //   await cloudinary.v2.uploader.destroy(property.imageDetails.public_id, {
      //     invalidate: true,
      //   });
      // }

      const resOfCloudinary = await cloudinary.v2.uploader.upload(file.path, {
        folder: config.get('cloudinary.folderPath'),
        public_id: `${config.get('cloudinary.publicId_prefix')}${Date.now()}`,
        transformation: [
          {
            width: config.get('cloudinary.bigSize').toString().split('X')[0],
            height: config.get('cloudinary.bigSize').toString().split('X')[1],
            crop: 'fill',
          },
          { quality: 'auto' },
        ],
      });

      unlinkSync(file.path);

      await this.propertyDB.findOneAndUpdate(
        { _id: id },
        {
          // imageDetails: resOfCloudinary,
          // image: resOfCloudinary.secure_url,
        },
      );

      return {
        message: 'Image uploaded successfully',
        success: true,
        result: resOfCloudinary.secure_url,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePropertyByName(
    propertyName: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<{
    message: string;
    result: Property;
    success: boolean;
  }> {
    try {
      const propertyExist = await this.propertyDB.findOne({ propertyName });
      if (!propertyExist) {
        throw new BadRequestException('Property does not exist');
      }

      const updateData = {
        propertyName: updatePropertyDto.propertyName,
        description: updatePropertyDto.description,
        price: updatePropertyDto.price,
        size: updatePropertyDto.size,
        location: updatePropertyDto.location,
        amenities: updatePropertyDto.amenities,
        updated_at: new Date(),
      };

      const updatedProperty = await this.propertyDB.findOneAndUpdate(
        { propertyName },
        updateData,
      );

      return {
        message: 'Property updated successfully',
        result: updatedProperty,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
