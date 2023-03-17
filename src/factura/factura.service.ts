import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { FastifyReply } from 'fastify';
import { Product } from 'src/product/entities/product.entity';
import { response } from 'src/comun/helpers/Response';

@Injectable()
export class FacturaService {
  constructor(
    @InjectModel(Factura.name)
    private readonly facturaModel: Model<Factura>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    req: any,
    reply: FastifyReply,
    createFacturaDto: CreateFacturaDto,
  ) {
    try {
      const { product, quantity } = createFacturaDto;
      const productEncontrado = await this.productModel.findById({
        _id: product,
      });
      if (!productEncontrado) {
        return response(
          reply,
          404,
          false,
          '',
          'el producto no existe en la base de datos',
        );
      }

      if (quantity > productEncontrado.stock) {
        return response(
          reply,
          400,
          false,
          '',
          `La quantity que desea comprar no esta disponible, el producto solo tiene un stock de ${productEncontrado.stock} `,
        );
      }

      await productEncontrado.updateOne({
        stock: productEncontrado.stock - quantity,
      });

      const factura = new this.facturaModel({
        ...createFacturaDto,
        user: req.user._id,
        total: productEncontrado.price * quantity,
      });

      await factura.save();
      return response(reply, 201, true, factura, 'registro creado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async findAll(reply: FastifyReply) {
    try {
      const data = await this.facturaModel
        .find()
        .populate('product')
        .populate('user');
      return response(reply, 200, true, data, 'lista de registros');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async findOne(reply: FastifyReply, id: string) {
    try {
      const data = await this.facturaModel
        .findById(id)
        .populate('product')
        .populate('user');
      if (!data) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }
      return response(reply, 200, true, data, 'registro encontrado');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async update(
    req: any,
    reply: FastifyReply,
    id: string,
    updateFacturaDto: UpdateFacturaDto,
  ) {
    try {
      const { product, quantity } = updateFacturaDto;

      const factura = await this.facturaModel.findById(id);
      if (!factura) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }

      const producto = await this.productModel.findById({
        _id: factura.product,
      });

      if (product !== factura.product.toString()) {
        const productEncontrado = await this.productModel.findById({
          _id: product,
        });

        if (!productEncontrado) {
          return response(
            reply,
            404,
            false,
            '',
            'el producto no existe en la base de datos',
          );
        }

        await producto.updateOne({
          stock: producto.stock + factura.quantity,
        });

        if (quantity > productEncontrado.stock) {
          return response(
            reply,
            400,
            false,
            '',
            `La quantity que desea comprar no esta disponible`,
          );
        }

        await productEncontrado.updateOne({
          stock: productEncontrado.stock - quantity,
        });

        await factura.updateOne({
          ...updateFacturaDto,
          user: req.userId,
          total: productEncontrado.price * quantity,
        });
      } else {
        if (quantity > producto.stock + factura.quantity) {
          return response(
            reply,
            400,
            false,
            '',
            `La quantity que desea comprar no esta disponible`,
          );
        }

        await producto.updateOne({
          stock: producto.stock + factura.quantity - quantity,
        });

        await factura.updateOne({
          ...req.body,
          user: req.user._id,
          total: producto.price * quantity,
        });
      }
      return response(reply, 200, true, '', 'factura actualizada');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  async remove(reply: FastifyReply, id: string) {
    try {
      const factura = await this.facturaModel.findById(id);
      if (!factura) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }

      const productEncontrado = await this.productModel.findById({
        _id: factura.product,
      });

      if (!productEncontrado) {
        return response(
          reply,
          404,
          false,
          '',
          'el producto no existe en la base de datos',
        );
      }

      await productEncontrado.updateOne({
        stock: productEncontrado.stock + factura.quantity,
      });

      await factura.deleteOne();
      return response(reply, 200, true, '', 'factura eliminada');
    } catch (error: any) {
      return this.catchMessage(reply, error);
    }
  }

  catchMessage(reply: FastifyReply, error: any) {
    return response(reply, 500, false, '', error.message);
  }
}
