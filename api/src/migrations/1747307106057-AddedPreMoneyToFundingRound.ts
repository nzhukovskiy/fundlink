import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPreMoneyToFundingRound1747307106057 implements MigrationInterface {
    name = 'AddedPreMoneyToFundingRound1747307106057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round" ADD "preMoney" numeric`);
        await queryRunner.query(`UPDATE "funding_round" SET "preMoney" = 0 WHERE "preMoney" IS NULL`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "preMoney" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round" DROP COLUMN "preMoney"`);
    }

}
