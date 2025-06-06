import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIPOExitDetails1748352049720 implements MigrationInterface {
    name = 'AddedIPOExitDetails1748352049720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit" ADD "ipoValuation" numeric`);
        await queryRunner.query(`ALTER TABLE "exit" ADD "sharePrice" numeric`);
        await queryRunner.query(`ALTER TABLE "exit" ADD "totalShares" numeric`);
        await queryRunner.query(`ALTER TABLE "exit" ADD "lockupPeriodDays" integer DEFAULT '180'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit" DROP COLUMN "lockupPeriodDays"`);
        await queryRunner.query(`ALTER TABLE "exit" DROP COLUMN "totalShares"`);
        await queryRunner.query(`ALTER TABLE "exit" DROP COLUMN "sharePrice"`);
        await queryRunner.query(`ALTER TABLE "exit" DROP COLUMN "ipoValuation"`);
    }

}
