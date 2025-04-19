import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStartupsExits1745083145037 implements MigrationInterface {
    name = 'AddedStartupsExits1745083145037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."exit_type_enum" AS ENUM('ACQUIRED', 'IPO', 'BANKRUPT')`);
        await queryRunner.query(`CREATE TABLE "exit" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."exit_type_enum" NOT NULL, "value" numeric NOT NULL, "startupId" integer, CONSTRAINT "REL_762899bc302658467d8b74f9e4" UNIQUE ("startupId"), CONSTRAINT "PK_cead9adb00eadcf23fbcecbdbe8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."startup_stage_enum" AS ENUM('ACTIVE', 'EXITED')`);
        await queryRunner.query(`ALTER TABLE "startup" ADD "stage" "public"."startup_stage_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('MESSAGE', 'INVESTMENT', 'FUNDING_ROUND_DEADLINE', 'FUNDING_ROUND_CHANGE_PROPOSAL', 'FUNDING_ROUND_CHANGE_PROPOSAL_FINISHED', 'FUNDING_ROUND_ENDED', 'STARTUP_EXIT')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "exit" ADD CONSTRAINT "FK_762899bc302658467d8b74f9e41" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit" DROP CONSTRAINT "FK_762899bc302658467d8b74f9e41"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('MESSAGE', 'INVESTMENT', 'FUNDING_ROUND_DEADLINE', 'FUNDING_ROUND_CHANGE_PROPOSAL', 'FUNDING_ROUND_CHANGE_PROPOSAL_FINISHED', 'FUNDING_ROUND_ENDED')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "stage"`);
        await queryRunner.query(`DROP TYPE "public"."startup_stage_enum"`);
        await queryRunner.query(`DROP TABLE "exit"`);
        await queryRunner.query(`DROP TYPE "public"."exit_type_enum"`);
    }

}
