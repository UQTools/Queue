import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1614256322210 implements MigrationInterface {
    name = "Migration1614256322210";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "course" ADD "alias" character varying'
        );
        await queryRunner.query(
            'ALTER TABLE "course" ADD CONSTRAINT "UQ_8a167196d86062fa6abf6f0d546" UNIQUE ("alias")'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "course" DROP CONSTRAINT "UQ_8a167196d86062fa6abf6f0d546"'
        );
        await queryRunner.query('ALTER TABLE "course" DROP COLUMN "alias"');
    }
}
