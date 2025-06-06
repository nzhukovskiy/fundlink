import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFieldsToInvestor1744893186050 implements MigrationInterface {
    name = 'AddedFieldsToInvestor1744893186050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor" ADD "title" character varying`);
        await queryRunner.query(`ALTER TABLE "investor" ADD "logoPath" character varying`);
        await queryRunner.query(`ALTER TABLE "investor" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "investor" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "logoPath"`);
        await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "title"`);
    }

}
