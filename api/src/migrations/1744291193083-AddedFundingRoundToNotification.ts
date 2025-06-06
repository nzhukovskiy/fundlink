import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFundingRoundToNotification1744291193083 implements MigrationInterface {
    name = 'AddedFundingRoundToNotification1744291193083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "fundingRoundId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_11a3e7895e83892c84009b61472" FOREIGN KEY ("fundingRoundId") REFERENCES "funding_round"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_11a3e7895e83892c84009b61472"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "fundingRoundId"`);
    }

}
