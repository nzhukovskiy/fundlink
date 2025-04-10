import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCascadeToProposalDeletion1744282391569 implements MigrationInterface {
    name = 'AddedCascadeToProposalDeletion1744282391569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_vote" DROP CONSTRAINT "FK_f7cacce3f94307400f5edbd94b8"`);
        await queryRunner.query(`ALTER TABLE "investor_vote" ADD CONSTRAINT "FK_f7cacce3f94307400f5edbd94b8" FOREIGN KEY ("proposalId") REFERENCES "funding_round_change_proposal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_vote" DROP CONSTRAINT "FK_f7cacce3f94307400f5edbd94b8"`);
        await queryRunner.query(`ALTER TABLE "investor_vote" ADD CONSTRAINT "FK_f7cacce3f94307400f5edbd94b8" FOREIGN KEY ("proposalId") REFERENCES "funding_round_change_proposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
