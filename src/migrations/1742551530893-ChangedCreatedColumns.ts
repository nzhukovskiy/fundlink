import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedCreatedColumns1742551530893 implements MigrationInterface {
    name = 'ChangedCreatedColumns1742551530893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "timestamp" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "timestamp" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "date" DROP DEFAULT`);
    }

}
