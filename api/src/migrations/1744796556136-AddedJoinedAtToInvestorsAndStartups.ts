import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedJoinedAtToInvestorsAndStartups1744796556136 implements MigrationInterface {
    name = 'AddedJoinedAtToInvestorsAndStartups1744796556136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor" ADD "joinedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "startup" ADD "joinedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "joinedAt"`);
        await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "joinedAt"`);
    }

}
