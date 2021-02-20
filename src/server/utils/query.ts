import values from "lodash/values";
import { User } from "../entities";
import { BaseEntity, FindOneOptions, ObjectID } from "typeorm";

type Constructor<I> = new (...args: any[]) => I;

export const checkFieldValueInEnum = <T extends any>(
    enumType: T,
    fieldName: string,
    isNumber: boolean = false
) => {
    return values(enumType)
        .filter((member) => !isNumber || typeof member === "number")
        .map(
            (member) => `"${fieldName}" = ${isNumber ? member : `'${member}'`}`
        )
        .join(" OR ");
};
