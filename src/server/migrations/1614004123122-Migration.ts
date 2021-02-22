import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1614004123122 implements MigrationInterface {
    name = "Migration1614004123122";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_user_meta" ADD CONSTRAINT "UQ_efc6e6ce1d0a41624e195edf963" UNIQUE ("userId", "courseId")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_user_meta" DROP CONSTRAINT "UQ_efc6e6ce1d0a41624e195edf963"`
        );
    }
}
