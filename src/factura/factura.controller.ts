import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@UseGuards(JwtService)
@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  create(
    @Req() req: any,
    @Res() reply: FastifyReply,
    @Body() createFacturaDto: CreateFacturaDto,
  ) {
    return this.facturaService.create(req, reply, createFacturaDto);
  }

  @Get()
  findAll(@Res() reply: FastifyReply) {
    return this.facturaService.findAll(reply);
  }

  @Get(':id')
  findOne(@Res() reply: FastifyReply, @Param('id') id: string) {
    return this.facturaService.findOne(reply, id);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Res() reply: FastifyReply,
    @Param('id') id: string,
    @Body() updateFacturaDto: UpdateFacturaDto,
  ) {
    return this.facturaService.update(req, reply, id, updateFacturaDto);
  }

  @Delete(':id')
  remove(@Res() reply: FastifyReply, @Param('id') id: string) {
    return this.facturaService.remove(reply, id);
  }
}
