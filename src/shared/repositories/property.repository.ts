import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from 'src/property/dto/create-property.dto';
import { Property } from '../schema/property';
import { License } from '../schema/license';

// Interface for find method options
interface ParsedOptions {
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  fields?: string[];
}

// Interface for find method response
interface FindPropertiesResponse {
  totalPropertyCount: number;
  properties: Property[];
}

// Interface for query parameters
interface QueryParams {
  search?: string;
  [key: string]: any;
}

@Injectable()
export class PropertyRepository {
  constructor(
    @InjectModel(Property.name) private readonly propertyModel: Model<Property>,
    @InjectModel(License.name) private readonly licenseModel: Model<License>,
  ) {}

  async create(property: CreatePropertyDto): Promise<Property> {
    const createdProperty = await this.propertyModel.create(property);
    return createdProperty;
  }

  async findOne(query: QueryParams): Promise<Property | null> {
    const property = await this.propertyModel.findOne(query);
    return property;
  }

  async findOneAndUpdate(
    query: QueryParams,
    update: Partial<Property>,
  ): Promise<Property | null> {
    const property = await this.propertyModel.findOneAndUpdate(query, update, {
      new: true,
    });
    return property;
  }

  async findOneAndDelete(query: QueryParams): Promise<Property | null> {
    const property = await this.propertyModel.findOneAndDelete(query);
    return property;
  }

  async findPropertyWithGroupBy(): Promise<any[]> {
    const properties = await this.propertyModel.aggregate([
      {
        $facet: {
          latestProperties: [{ $sort: { createdAt: -1 } }, { $limit: 4 }],
          topRatedProperties: [{ $sort: { avgRating: -1 } }, { $limit: 8 }],
        },
      },
    ]);
    return properties;
  }

  async find(
    query: QueryParams,
    options: ParsedOptions,
  ): Promise<FindPropertiesResponse> {
    // Set default values for options
    const finalOptions = {
      sort: options.sort || { stripeProductId: 1 },
      limit: options.limit || 12,
      skip: options.skip || 0,
    };

    // Handle search query
    const finalQuery = { ...query };
    if (finalQuery.search) {
      finalQuery.propertyName = new RegExp(finalQuery.search, 'i');
      delete finalQuery.search;
    }

    // Execute aggregation pipeline
    const properties = await this.propertyModel.aggregate([
      {
        $match: finalQuery,
      },
      {
        $sort: finalOptions.sort,
      },
      { $skip: finalOptions.skip },
      { $limit: finalOptions.limit },
    ]);

    const totalPropertyCount =
      await this.propertyModel.countDocuments(finalQuery);
    return {
      totalPropertyCount, 
      properties,
    };
  }

  async findRelatedProperties(query: QueryParams): Promise<Property[]> {
    const properties = await this.propertyModel.aggregate([
      {
        $match: query,
      },
      {
        $sample: { size: 4 },
      },
    ]);
    return properties;
  }

  async removeLicense(query: QueryParams): Promise<License | null> {
    const license = await this.licenseModel.findOneAndDelete(query);
    return license;
  }

  async findLicense(query: QueryParams, limit?: number): Promise<License[]> {
    if (limit && limit > 0) {
      return await this.licenseModel.find(query).limit(limit);
    }
    return await this.licenseModel.find(query);
  }

  async deleteSku(id: string, skuId: string): Promise<any> {
    return await this.propertyModel.updateOne(
      { _id: id },
      {
        $pull: {
          skuDetails: { _id: skuId },
        },
      },
    );
  }
}




