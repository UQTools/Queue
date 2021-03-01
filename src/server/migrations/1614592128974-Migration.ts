import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1614592128974 implements MigrationInterface {
    name = 'Migration1614592128974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "claimTime"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "claimTime" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "claimTime"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "claimTime" TIMESTAMP`);
    }

}
