import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613804997778 implements MigrationInterface {
    name = "Migration1613804997778";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" DROP CONSTRAINT \"FK_730dbd0489dfe2c9c46f23b3375\""
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" DROP CONSTRAINT \"FK_3abb26ab7f62567c12d71c32a9b\""
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ALTER COLUMN \"userId\" SET NOT NULL"
        );
        await queryRunner.query(
            "COMMENT ON COLUMN \"course_user_meta\".\"userId\" IS NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ALTER COLUMN \"courseId\" SET NOT NULL"
        );
        await queryRunner.query(
            "COMMENT ON COLUMN \"course_user_meta\".\"courseId\" IS NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ADD CONSTRAINT \"FK_730dbd0489dfe2c9c46f23b3375\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ADD CONSTRAINT \"FK_3abb26ab7f62567c12d71c32a9b\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" DROP CONSTRAINT \"FK_3abb26ab7f62567c12d71c32a9b\""
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" DROP CONSTRAINT \"FK_730dbd0489dfe2c9c46f23b3375\""
        );
        await queryRunner.query(
            "COMMENT ON COLUMN \"course_user_meta\".\"courseId\" IS NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ALTER COLUMN \"courseId\" DROP NOT NULL"
        );
        await queryRunner.query(
            "COMMENT ON COLUMN \"course_user_meta\".\"userId\" IS NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ALTER COLUMN \"userId\" DROP NOT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ADD CONSTRAINT \"FK_3abb26ab7f62567c12d71c32a9b\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_user_meta\" ADD CONSTRAINT \"FK_730dbd0489dfe2c9c46f23b3375\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
    }
}
