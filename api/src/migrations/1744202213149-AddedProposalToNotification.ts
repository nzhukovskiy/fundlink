import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProposalToNotification1744202213149 implements MigrationInterface {
    name = 'AddedProposalToNotification1744202213149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "changesId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_284a2fa57f5312a0123fd209c1e" FOREIGN KEY ("changesId") REFERENCES "funding_round_change_proposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_284a2fa57f5312a0123fd209c1e"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "changesId"`);
    }

}
