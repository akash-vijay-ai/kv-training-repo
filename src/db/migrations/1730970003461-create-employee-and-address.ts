import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeAndAddress1730970003461 implements MigrationInterface {
    name = 'CreateEmployeeAndAddress1730970003461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "line1" character varying NOT NULL, "pincode" character varying NOT NULL, "employee_id" integer NOT NULL, CONSTRAINT "REL_7e77f562043393b08de949b804" UNIQUE ("employee_id"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_7e77f562043393b08de949b804b" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
