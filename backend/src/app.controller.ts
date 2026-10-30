import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { AppService, ProductInput } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly app: AppService) {}
  @Get('products') products(@Query('category') category?: string) { return this.app.products(category); }
  @Post('login') login(@Body() body: { email: string; password: string }) { return this.app.login(body.email, body.password); }
  @Get('admin/products') adminProducts(@Headers('authorization') auth: string, @Query('category') category?: string) { this.app.authorize(auth); return this.app.products(category); }
  @Post('admin/products') create(@Headers('authorization') auth: string, @Body() body: ProductInput) { this.app.authorize(auth); return this.app.createProduct(body); }
  @Put('admin/products/:id') update(@Headers('authorization') auth: string, @Param('id') id: string, @Body() body: ProductInput) { this.app.authorize(auth); return this.app.updateProduct(Number(id), body); }
  @Delete('admin/products/:id') async remove(@Headers('authorization') auth: string, @Param('id') id: string) { this.app.authorize(auth); return { deleted: await this.app.deleteProduct(Number(id)) }; }
  @Get('admin/orders') orders(@Headers('authorization') auth: string) { this.app.authorize(auth); return this.app.orders(); }
  @Post('checkout') checkout(@Body() body: { customerName: string; customerEmail: string; items: { productId: number; quantity: number }[] }) { return this.app.checkout(body); }
}
