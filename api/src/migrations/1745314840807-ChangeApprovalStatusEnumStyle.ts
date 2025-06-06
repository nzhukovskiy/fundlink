import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeApprovalStatusEnumStyle1745314840807 implements MigrationInterface {
    name = 'ChangeApprovalStatusEnumStyle1745314840807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "funding_round_change_proposal" SET "status" = UPPER("status");`);

        await queryRunner.query(`ALTER TYPE "public"."funding_round_change_proposal_status_enum" RENAME TO "funding_round_change_proposal_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."funding_round_change_proposal_status_enum" AS ENUM('PENDING_REVIEW', 'COMPLETED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" TYPE "public"."funding_round_change_proposal_status_enum" USING "status"::"text"::"public"."funding_round_change_proposal_status_enum"`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" SET DEFAULT 'PENDING_REVIEW'`);
        await queryRunner.query(`DROP TYPE "public"."funding_round_change_proposal_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "funding_round_change_proposal" SET "status" = LOWER("status");`);

        await queryRunner.query(`CREATE TYPE "public"."funding_round_change_proposal_status_enum_old" AS ENUM('pending_review', 'completed', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" TYPE "public"."funding_round_change_proposal_status_enum_old" USING "status"::"text"::"public"."funding_round_change_proposal_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ALTER COLUMN "status" SET DEFAULT 'pending_review'`);
        await queryRunner.query(`DROP TYPE "public"."funding_round_change_proposal_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."funding_round_change_proposal_status_enum_old" RENAME TO "funding_round_change_proposal_status_enum"`);
    }

}
