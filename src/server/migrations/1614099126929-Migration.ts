import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1614099126929 implements MigrationInterface {
    name = "Migration1614099126929";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"weekly_event\" DROP CONSTRAINT \"PK_8d1a1a9292c5bfec77c21270e67\""
        );
        await queryRunner.query("ALTER TABLE \"weekly_event\" DROP COLUMN \"id\"");
        await queryRunner.query(
            "ALTER TABLE \"weekly_event\" ADD \"id\" uuid NOT NULL DEFAULT uuid_generate_v4()"
        );
        await queryRunner.query(
            "ALTER TABLE \"weekly_event\" ADD CONSTRAINT \"PK_8d1a1a9292c5bfec77c21270e67\" PRIMARY KEY (\"id\")"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"weekly_event\" DROP CONSTRAINT \"PK_8d1a1a9292c5bfec77c21270e67\""
        );
        await queryRunner.query("ALTER TABLE \"weekly_event\" DROP COLUMN \"id\"");
        await queryRunner.query(
            "ALTER TABLE \"weekly_event\" ADD \"id\" SERIAL NOT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"weekly_event\" ADD CONSTRAINT \"PK_8d1a1a9292c5bfec77c21270e67\" PRIMARY KEY (\"id\")"
        );
    }
}
