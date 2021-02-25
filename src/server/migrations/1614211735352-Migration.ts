import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1614211735352 implements MigrationInterface {
    name = "Migration1614211735352";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" ADD "showEnrolledSession" boolean NOT NULL DEFAULT false'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" DROP COLUMN "showEnrolledSession"'
        );
    }
}
