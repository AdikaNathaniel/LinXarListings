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
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/shared/middleware/role.decorators';
import { userTypes } from 'src/shared/schema/users';
import { GetProductQueryDto } from './dto/get-product-query-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import config from 'config';
import { ProductSkuDto, ProductSkuDtoArr } from './dto/product-sku.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAll(@Query() query: GetProductQueryDto) {
    return this.productsService.findAllProducts(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  @Roles(userTypes.ADMIN, userTypes.REAL_ESTATE_AGENT)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('name/:productName')
  removeByName(@Param('productName') productName: string) {
    return this.productsService.removeProductByName(productName);
  }

  @Post('/:id/image')
  @Roles(userTypes.ADMIN)
  @UseInterceptors(
    FileInterceptor('productImage', {
      dest: config.get('fileStoragePath'),
      limits: {
        fileSize: 3145728, // 3 MB
      },
    }),
  )
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: ParameterDecorator,
  ) {
    return await this.productsService.uploadProductImage(id, file);
  }

  @Post('update/:productName')
  updateByName(
    @Param('productName') productName: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductByName(productName, updateProductDto);
  }
}
