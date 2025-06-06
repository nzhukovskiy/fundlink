import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedSeparateIpoValue1748352697293 implements MigrationInterface {
    name = 'RemovedSeparateIpoValue1748352697293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit" DROP COLUMN "ipoValuation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit" ADD "ipoValuation" numeric`);
    }

}
