import { MigrationInterface, QueryRunner } from "typeorm";

export class RolesEnumStyle1745316931657 implements MigrationInterface {
    name = 'RolesEnumStyle1745316931657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "senderType" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "message" SET "senderType" = UPPER("senderType");`);

        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "userType" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "notification" SET "userType" = UPPER("userType");`);

        await queryRunner.query(`ALTER TYPE "public"."message_sendertype_enum" RENAME TO "message_sendertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."message_sendertype_enum" AS ENUM('STARTUP', 'INVESTOR')`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "senderType" TYPE "public"."message_sendertype_enum" USING "senderType"::"text"::"public"."message_sendertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."message_sendertype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_usertype_enum" RENAME TO "notification_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_usertype_enum" AS ENUM('STARTUP', 'INVESTOR')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "userType" TYPE "public"."notification_usertype_enum" USING "userType"::"text"::"public"."notification_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_usertype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "senderType" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "message" SET "senderType" = LOWER("senderType");`);

        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "userType" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "notification" SET "userType" = LOWER("userType");`);

        await queryRunner.query(`CREATE TYPE "public"."notification_usertype_enum_old" AS ENUM('startup', 'investor')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "userType" TYPE "public"."notification_usertype_enum_old" USING "userType"::"text"::"public"."notification_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_usertype_enum_old" RENAME TO "notification_usertype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."message_sendertype_enum_old" AS ENUM('startup', 'investor')`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "senderType" TYPE "public"."message_sendertype_enum_old" USING "senderType"::"text"::"public"."message_sendertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."message_sendertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."message_sendertype_enum_old" RENAME TO "message_sendertype_enum"`);
    }

}
