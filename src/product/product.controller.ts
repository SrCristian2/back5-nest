import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Res,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { diskStorage, FileFastifyInterceptor } from 'fastify-file-interceptor';
import { fileFilter } from 'src/comun/helpers/fileFilter.helper';
import { fileName } from 'src/comun/helpers/fileName.fileFilter';
import { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@UseGuards(JwtService)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFastifyInterceptor('img', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: fileName,
      }),
    }),
  )
  create(
    @Req() req: any,
    @Res() reply: FastifyReply,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(req, reply, file, createProductDto);
  }

  @Get()
  findAll(@Res() reply: FastifyReply) {
    return this.productService.findAll(reply);
  }

  @Get(':id')
  findOne(@Res() reply: FastifyReply, @Param('id') id: string) {
    return this.productService.findOne(reply, id);
  }

  @Put(':id')
  @UseInterceptors(
    FileFastifyInterceptor('img', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: fileName,
      }),
    }),
  )
  update(
    @Res() reply: FastifyReply,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(reply, file, id, updateProductDto);
  }

  @Delete(':id')
  remove(@Res() reply: FastifyReply, @Param('id') id: string) {
    return this.productService.remove(reply, id);
  }
}
