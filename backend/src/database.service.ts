import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/voltiolabDB',
  });

  query<T extends object = object>(text: string, values: unknown[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, values);
  }

  transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    return this.pool.connect().then(async (client) => {
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
