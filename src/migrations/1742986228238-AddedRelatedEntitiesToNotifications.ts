import { MigrationInterface, QueryRunner } from "typeorm";
import { query } from "express"

export class AddedRelatedEntitiesToNotifications1742986228238 implements MigrationInterface {
    name = 'AddedRelatedEntitiesToNotifications1742986228238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("notification", "message", "text");
        await queryRunner.query(`ALTER TABLE "notification" ADD "messageId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "investmentId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_e77398d5c03520ca87c7c03ca9f" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_859ed1dc857f9467759bae16eec" FOREIGN KEY ("investmentId") REFERENCES "investment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_859ed1dc857f9467759bae16eec"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_e77398d5c03520ca87c7c03ca9f"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "investmentId"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "messageId"`);
        await queryRunner.renameColumn("notification", "text", "message");
    }

}
