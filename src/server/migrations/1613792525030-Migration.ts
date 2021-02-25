import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613792525030 implements MigrationInterface {
    name = "Migration1613792525030";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"question\" DROP CONSTRAINT \"CHK_d6a250a0c8da121685e90984eb\""
        );
        await queryRunner.query(
            "ALTER TABLE \"queue\" ADD \"clearAfterMidnight\" boolean NOT NULL DEFAULT false"
        );
        await queryRunner.query(
            "ALTER TABLE \"queue\" ADD \"lastAccessed\" TIMESTAMP NOT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" DROP CONSTRAINT \"FK_6381748e499c8913003dc2adaa9\""
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" ALTER COLUMN \"claimerId\" SET NOT NULL"
        );
        await queryRunner.query(
            "COMMENT ON COLUMN \"question\".\"claimerId\" IS NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" ADD CONSTRAINT \"CHK_8866d3665b7e56bea6f6846ff1\" CHECK (\"status\" = 'Open' OR \"status\" = 'Claimed' OR \"status\" = 'Closed' OR \"status\" = 'Accepted')"
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" ADD CONSTRAINT \"FK_6381748e499c8913003dc2adaa9\" FOREIGN KEY (\"claimerId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"question\" DROP CONSTRAINT \"FK_6381748e499c8913003dc2adaa9\""
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" DROP CONSTRAINT \"CHK_8866d3665b7e56bea6f6846ff1\""
        );
        await queryRunner.query(
            "COMMENT ON COLUMN \"question\".\"claimerId\" IS NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" ALTER COLUMN \"claimerId\" DROP NOT NULL"
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" ADD CONSTRAINT \"FK_6381748e499c8913003dc2adaa9\" FOREIGN KEY (\"claimerId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION"
        );
        await queryRunner.query(
            "ALTER TABLE \"queue\" DROP COLUMN \"lastAccessed\""
        );
        await queryRunner.query(
            "ALTER TABLE \"queue\" DROP COLUMN \"clearAfterMidnight\""
        );
        await queryRunner.query(
            "ALTER TABLE \"question\" ADD CONSTRAINT \"CHK_d6a250a0c8da121685e90984eb\" CHECK ((((status)::text = 'Open'::text) OR ((status)::text = 'Claimed'::text) OR ((status)::text = 'Closed'::text)))"
        );
    }
}
