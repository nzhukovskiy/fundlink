import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFundingRoundIndex1748185072388 implements MigrationInterface {
    name = 'AddedFundingRoundIndex1748185072388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_cad7385a39566468b780e0e17c" ON "funding_round" ("startupId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cad7385a39566468b780e0e17c"`);
    }

}
