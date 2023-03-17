import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';
import { FastifyReply } from 'fastify';
import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from 'src/comun/helpers/UploadImg';
import { response } from 'src/comun/helpers/Response';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    reply: FastifyReply,
    file: Express.Multer.File,
    createCategoryDto: CreateCategoryDto,
  ) {
    try {
      const { name, description } = createCategoryDto;

      const newCategory = new this.categoryModel({
        name,
        description,
      });

      if (file) {
        const { secure_url, public_id } = await subirImagenACloudinary(file);
        newCategory.setImg(secure_url, public_id);
      }

      await this.categoryModel.create(newCategory);
      return response(reply, 201, true, newCategory, 'registro creado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async findAll(reply: FastifyReply) {
    try {
      const data = await this.categoryModel.find();
      return response(reply, 200, true, data, 'lista de categorias');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async findOne(reply: FastifyReply, id: string) {
    try {
      const data = await this.categoryModel.findById(id);
      if (!data) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }
      response(reply, 200, true, data, 'registro encontrado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async update(
    reply: FastifyReply,
    file: Express.Multer.File,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const data = await this.categoryModel.findById(id);
      if (!data) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }

      if (file) {
        if (data.public_id) {
          await eliminarImagenCloudinary(data.public_id);
        }
        const { secure_url, public_id } = await subirImagenACloudinary(file);
        data.setImg(secure_url, public_id);
        await data.save();
      }

      await data.updateOne(updateCategoryDto);
      return response(reply, 200, true, '', 'registro actualizado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async remove(reply: FastifyReply, id: string) {
    try {
      const data = await this.categoryModel.findById(id);
      if (!data) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }

      const productEncontrado = await this.productModel.findOne({
        category: data._id,
      });
      if (productEncontrado) {
        return response(
          reply,
          400,
          false,
          '',
          'esta categoria no se puede eliminar porque tiene productos vinculados',
        );
      }

      if (data.public_id) {
        await eliminarImagenCloudinary(data.public_id);
      }

      await data.deleteOne();
      response(reply, 200, true, '', 'registro eliminado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }
  catchMessage(reply: FastifyReply, error: any) {
    return response(reply, 500, false, '', error.message);
  }
}
