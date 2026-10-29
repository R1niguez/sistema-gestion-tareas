import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { DatabaseService } from './database.service';

export type ProductCategory = 'arduino' | 'esp32' | 'modulos';
export interface ProductInput {
  category: ProductCategory;
  name: string;
  price: number;
  description: string;
  image: string;
  active?: boolean;
}

@Injectable()
export class AppService {
  private readonly tokens = new Set<string>();

  constructor(private readonly db: DatabaseService) {}

  async bootstrap(): Promise<void> {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin');
      CREATE TABLE IF NOT EXISTS products (id BIGSERIAL PRIMARY KEY, category TEXT NOT NULL
      CHECK (category IN ('arduino', 'esp32', 'modulos')), name TEXT NOT NULL, price NUMERIC(10,2)
      NOT NULL CHECK (price >= 0), description TEXT NOT NULL, image TEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE);
      CREATE TABLE IF NOT EXISTS orders (id BIGSERIAL PRIMARY KEY, customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL, total NUMERIC(10,2) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS order_items (id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id),
      product_id BIGINT REFERENCES products(id) ON DELETE SET NULL, product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0), unit_price NUMERIC(10,2) NOT NULL);
      CREATE TABLE IF NOT EXISTS payments (id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id),
      method TEXT NOT NULL, status TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL);
    `);
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(process.env.ADMIN_PASSWORD || 'admin123', salt, 64).toString('hex');
    await this.db.query(
      'INSERT INTO users (email, password_hash, salt, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      [process.env.ADMIN_EMAIL || 'admin@voltiolab.com', hash, salt, 'admin'],
    );
    const { rowCount } = await this.db.query('SELECT id FROM products LIMIT 1');
    if (!rowCount) {
      await this.db.query(`
        INSERT INTO products (category, name, price, description, image) VALUES
        ('arduino','Arduino Uno R3',18.90,'Ideal para comenzar con programación, LEDs y sensores.','https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=85'),
        ('arduino','Arduino Nano',14.20,'Potencia de Arduino en formato pequeño para prototipos.','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85'),
        ('arduino','Arduino Mega 2560',29.90,'Más pines para proyectos grandes y muchas conexiones.','https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85'),
        ('esp32','ESP32 DevKit V1',12.50,'El todoterreno para prototipos conectados y domótica.','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85'),
        ('esp32','ESP32 C3 SuperMini',9.80,'Tamaño mínimo para wearables y proyectos eficientes.','https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=85'),
        ('esp32','Kit ESP32 + sensores',27.00,'Una base completa para tu primera estación conectada.','https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85'),
        ('modulos','Kit inicio de sensores',24.00,'Sensores de luz, temperatura, distancia y movimiento.','https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85'),
        ('modulos','Display OLED 0.96',6.40,'Una pantalla nítida y compacta para datos en tiempo real.','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85'),
        ('modulos','Driver puente H L298N',8.90,'Controla motores DC y lleva tus robots un paso más allá.','https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=85')
      `);
    }
  }

  async products(category?: string) {
    const values = category ? [category] : [];
    const where = category ? 'WHERE category = $1 AND active = TRUE' : 'WHERE active = TRUE';
    return (await this.db.query(`SELECT * FROM products ${where} ORDER BY id`, values)).rows;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const result = await this.db.query<{ password_hash: string; salt: string }>(
      'SELECT password_hash, salt FROM users WHERE email = $1 AND role = $2', [email, 'admin'],
    );
    const user = result.rows[0];
    if (!user) throw new UnauthorizedException('Credenciales inválidas.');
    const actual = scryptSync(password, user.salt, 64);
    if (!timingSafeEqual(actual, Buffer.from(user.password_hash, 'hex'))) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const token = randomBytes(32).toString('hex');
    this.tokens.add(token);
    return { token };
  }

  authorize(authorization?: string): void {
    const token = authorization?.replace(/^Bearer\s+/i, '');
    if (!token || !this.tokens.has(token)) throw new UnauthorizedException('Token inválido.');
  }

  async createProduct(input: ProductInput) {
    this.validateProduct(input);
    return (await this.db.query(
      'INSERT INTO products (category,name,price,description,image,active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [input.category, input.name.trim(), input.price, input.description.trim(), input.image, input.active ?? true],
    )).rows[0];
  }

  async updateProduct(id: number, input: ProductInput) {
    this.validateProduct(input);
    const result = await this.db.query(
      'UPDATE products SET category=$1,name=$2,price=$3,description=$4,image=$5,active=$6 WHERE id=$7 RETURNING *',
      [input.category, input.name.trim(), input.price, input.description.trim(), input.image, input.active ?? true, id],
    );
    return result.rows[0] || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return (await this.db.query('DELETE FROM products WHERE id=$1', [id])).rowCount === 1;
  }

  async orders() {
    return (await this.db.query('SELECT * FROM orders ORDER BY created_at DESC')).rows;
  }

  async checkout(input: { customerName: string; customerEmail: string; items: { productId: number; quantity: number }[] }) {
    if (!input.customerName?.trim() || !input.customerEmail?.includes('@') || !input.items?.length) {
      throw new Error('Datos de checkout incompletos.');
    }
    return this.db.transaction(async (client) => {
      let total = 0;
      const products: { id: number; name: string; price: number }[] = [];
      for (const item of input.items) {
        const result = await client.query('SELECT id,name,price FROM products WHERE id=$1 AND active=TRUE', [item.productId]);
        if (!result.rows[0] || !Number.isInteger(item.quantity) || item.quantity < 1) throw new Error('Producto o cantidad inválida.');
        products.push(result.rows[0]);
        total += Number(result.rows[0].price) * item.quantity;
      }
      const order = (await client.query(
        'INSERT INTO orders (customer_name,customer_email,total) VALUES ($1,$2,$3) RETURNING *',
        [input.customerName.trim(), input.customerEmail.trim(), total],
      )).rows[0];
      for (const [index, product] of products.entries()) {
        await client.query(
          'INSERT INTO order_items (order_id,product_id,product_name,quantity,unit_price) VALUES ($1,$2,$3,$4,$5)',
          [order.id, product.id, product.name, input.items[index].quantity, product.price],
        );
      }
      await client.query('INSERT INTO payments (order_id,method,status,amount) VALUES ($1,$2,$3,$4)', [order.id, 'pending', 'pending', total]);
      return order;
    });
  }

  private validateProduct(input: ProductInput): void {
    if (!['arduino', 'esp32', 'modulos'].includes(input.category) || !input.name?.trim() || Number(input.price) < 0 ||
      !input.description?.trim() || !input.image?.trim()) {
      throw new Error('Los datos del producto no son válidos.');
    }
  }
}
