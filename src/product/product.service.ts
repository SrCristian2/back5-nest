import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FastifyReply } from 'fastify';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from 'src/comun/helpers/UploadImg';
import { response } from 'src/comun/helpers/Response';
import { Factura } from 'src/factura/entities/factura.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Factura.name)
    private readonly facturaModel: Model<Factura>,
  ) {}

  async create(
    req: any,
    reply: FastifyReply,
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ) {
    try {
      const newProduct = new this.productModel({
        ...createProductDto,
        user: req.user._id,
      });

      if (file) {
        const { secure_url, public_id } = await subirImagenACloudinary(file);
        newProduct.setImg(secure_url, public_id);
      }
      await this.productModel.create(newProduct);
      return response(reply, 201, true, newProduct, 'registro creado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async findAll(reply: FastifyReply) {
    try {
      const data = await this.productModel
        .find()
        .populate('category')
        .populate('user');
      return response(reply, 200, true, data, 'lista de productos');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async findOne(reply: FastifyReply, id: string) {
    try {
      const data = await this.productModel
        .findById(id)
        .populate('category')
        .populate('user', '-password');
      if (!data) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }
      return response(reply, 200, true, data, 'registro encontrado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async update(
    reply: FastifyReply,
    file: Express.Multer.File,
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const data = await this.productModel.findById(id);
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

      await data.updateOne(updateProductDto);
      return response(reply, 200, true, '', 'registro actualizado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async remove(reply: FastifyReply, id: string) {
    try {
      const data = await this.productModel.findById(id);
      if (!data) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }

      const factura = await this.facturaModel.findOne({ product: data._id });
      if (factura) {
        return response(
          reply,
          400,
          false,
          '',
          'este producto no se puede eliminar porque tiene al menos una factura vinculada',
        );
      }

      if (data.public_id) {
        await eliminarImagenCloudinary(data.public_id);
      }

      await data.deleteOne();
      return response(reply, 200, true, '', 'registro eliminado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  catchMessage(reply: FastifyReply, error: any) {
    return response(reply, 500, false, '', error.message);
  }
}
