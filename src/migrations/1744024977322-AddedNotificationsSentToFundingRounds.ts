import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNotificationsSentToFundingRounds1744024977322 implements MigrationInterface {
    name = 'AddedNotificationsSentToFundingRounds1744024977322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round" ADD "notificationsSent" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round" DROP COLUMN "notificationsSent"`);
    }

}
