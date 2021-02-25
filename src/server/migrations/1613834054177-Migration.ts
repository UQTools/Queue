import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613834054177 implements MigrationInterface {
    name = "Migration1613834054177";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"room\" DROP CONSTRAINT \"FK_1cd9109e475c5a95bba8612a9d9\""
        );
        await queryRunner.query(
            "ALTER TABLE \"room\" ALTER COLUMN \"courseId\" SET NOT NULL"
        );
        await queryRunner.query("COMMENT ON COLUMN \"room\".\"courseId\" IS NULL");
        await queryRunner.query(
            "ALTER TABLE \"room\" ADD CONSTRAINT \"FK_1cd9109e475c5a95bba8612a9d9\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"room\" DROP CONSTRAINT \"FK_1cd9109e475c5a95bba8612a9d9\""
        );
        await queryRunner.query("COMMENT ON COLUMN \"room\".\"courseId\" IS NULL");
        await queryRunner.query(
            "ALTER TABLE \"room\" ALTER COLUMN \"courseId\" DROP NOT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"room\" ADD CONSTRAINT \"FK_1cd9109e475c5a95bba8612a9d9\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
    }
}
