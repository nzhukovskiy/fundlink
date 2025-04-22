import { MigrationInterface, QueryRunner } from "typeorm";

export class FundingStageEnumStyle1745316033119 implements MigrationInterface {
    name = 'FundingStageEnumStyle1745316033119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "funding_round" SET "stage" = UPPER("stage");`);

        await queryRunner.query(`ALTER TYPE "public"."funding_round_stage_enum" RENAME TO "funding_round_stage_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."funding_round_stage_enum" AS ENUM('SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D', 'SERIES_E')`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" TYPE "public"."funding_round_stage_enum" USING "stage"::"text"::"public"."funding_round_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" SET DEFAULT 'SEED'`);
        await queryRunner.query(`DROP TYPE "public"."funding_round_stage_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "funding_round" SET "stage" = LOWER("stage");`);

        await queryRunner.query(`CREATE TYPE "public"."funding_round_stage_enum_old" AS ENUM('seed', 'series_a', 'series_b', 'series_c', 'series_d', 'series_e')`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" TYPE "public"."funding_round_stage_enum_old" USING "stage"::"text"::"public"."funding_round_stage_enum_old"`);
        await queryRunner.query(`ALTER TABLE "funding_round" ALTER COLUMN "stage" SET DEFAULT 'seed'`);
        await queryRunner.query(`DROP TYPE "public"."funding_round_stage_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."funding_round_stage_enum_old" RENAME TO "funding_round_stage_enum"`);
    }

}
