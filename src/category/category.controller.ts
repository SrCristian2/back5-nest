import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileFastifyInterceptor, diskStorage } from 'fastify-file-interceptor';
import { fileFilter } from 'src/comun/helpers/fileFilter.helper';
import { fileName } from 'src/comun/helpers/fileName.fileFilter';
import { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@UseGuards(JwtService)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    @Res() reply: FastifyReply,
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(reply, file, createCategoryDto);
  }

  @Get()
  findAll(@Res() reply: FastifyReply) {
    return this.categoryService.findAll(reply);
  }

  @Get(':id')
  findOne(@Res() reply: FastifyReply, @Param('id') id: string) {
    return this.categoryService.findOne(reply, id);
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(reply, file, id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Res() reply: FastifyReply, @Param('id') id: string) {
    return this.categoryService.remove(reply, id);
  }
}
