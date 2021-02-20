import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613802309050 implements MigrationInterface {
    name = "Migration1613802309050";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE \"course_staff\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"role\" character varying NOT NULL, \"courseId\" uuid NOT NULL, \"userId\" uuid NOT NULL, CONSTRAINT \"UQ_50a755fd485b8353f7c293ec5d4\" UNIQUE (\"userId\", \"courseId\"), CONSTRAINT \"CHK_0ce1e4e9dd7918c677ec6da607\" CHECK (\"role\" = 'Staff' OR \"role\" = 'Coordinator'), CONSTRAINT \"PK_6bc9388e2bf79cf6de4678dc81b\" PRIMARY KEY (\"id\"))"
        );
        await queryRunner.query("COMMENT ON COLUMN \"queue\".\"examples\" IS NULL");
        await queryRunner.query(
            "ALTER TABLE \"user\" ALTER COLUMN \"isOnline\" SET DEFAULT false"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_staff\" ADD CONSTRAINT \"FK_2e099fcbb0ffe5108a4df4b31c8\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
        await queryRunner.query(
            "ALTER TABLE \"course_staff\" ADD CONSTRAINT \"FK_7e0675201d7cc340eccbca792f7\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"course_staff\" DROP CONSTRAINT \"FK_7e0675201d7cc340eccbca792f7\""
        );
        await queryRunner.query(
            "ALTER TABLE \"course_staff\" DROP CONSTRAINT \"FK_2e099fcbb0ffe5108a4df4b31c8\""
        );
        await queryRunner.query(
            "ALTER TABLE \"user\" ALTER COLUMN \"isOnline\" DROP DEFAULT"
        );
        await queryRunner.query("COMMENT ON COLUMN \"user\".\"isOnline\" IS NULL");
        await queryRunner.query("DROP TABLE \"course_staff\"");
    }
}
