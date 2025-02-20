import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Roles } from 'src/shared/middleware/role.decorators';
import { userTypes } from 'src/shared/schema/users';
import { GetPropertyQueryDto } from './dto/get-property-query-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import config from 'config';
import { Multer } from 'multer';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @Roles(userTypes.ADMIN, userTypes.REAL_ESTATE_AGENT)
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    try {
      return await this.propertyService.createProperty(createPropertyDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(@Query() query: GetPropertyQueryDto) {
    try {
      return await this.propertyService.findAllProperties(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.propertyService.findOneProperty(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @Roles(userTypes.ADMIN, userTypes.REAL_ESTATE_AGENT)
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    try {
      return await this.propertyService.updateProperty(id, updatePropertyDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('name/:propertyName')
  @Roles(userTypes.ADMIN)
  async removeByName(@Param('propertyName') propertyName: string) {
    try {
      return await this.propertyService.removePropertyByName(propertyName);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/image')
  @Roles(userTypes.ADMIN)
  @UseInterceptors(
    FileInterceptor('propertyImage', {
      dest: config.get('fileStoragePath'),
      limits: {
        fileSize: 3145728, // 3 MB
      },
    }),
  )
  async uploadPropertyImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.propertyService.uploadPropertyImage(id, file);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('update/:propertyName')
  @Roles(userTypes.ADMIN, userTypes.REAL_ESTATE_AGENT)
  async updateByName(
    @Param('propertyName') propertyName: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    try {
      return await this.propertyService.updatePropertyByName(
        propertyName,
        updatePropertyDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
