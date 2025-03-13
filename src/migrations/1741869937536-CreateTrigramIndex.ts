import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrigramIndex1741869937536 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_startup_title_gin ON startup USING gin (title gin_trgm_ops)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_startup_title_gin`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm`);
    }

}
