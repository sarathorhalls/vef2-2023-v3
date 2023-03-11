import dotenv from 'dotenv';
import { readFile } from "fs/promises";
import { query, poolEnd, insertCourse, insertDepartment } from "../lib/db.js";
import { parseCsv, parseJson } from "./parse.js";
import { join } from "path";
import { Department } from "../types.js";

dotenv.config();

const SCHEMA_FILE = './sql/schema.sql';
const DROP_FILE = './sql/drop.sql';
const DATA_DIR = './data';

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const schema = await readFile(schemaFile);
  if (!schema) {
    throw new Error('schema file not found');
  }

    return query(schema.toString('utf-8'));  
}

export async function dropSchema(dropFile = DROP_FILE) {
    const schema = await readFile(dropFile);
    if (!schema) {
        throw new Error('drop file not found');
    }
    
        return query(schema.toString('utf-8'));  
}

async function setup() {
    const drop = await dropSchema();

    if (drop) {
        console.log('drop successful');
    } else {
        console.error('schema not dropped');
        poolEnd();
        return process.exit(-1);
    }

    const result = await createSchema();

    if (result) {
        console.log('schema created');
    } else {
        console.error('schema not created');
        poolEnd();
        return process.exit(-1);
    }

    const indexFile = await readFile(join(DATA_DIR, 'index.json'));
    const indexData = parseJson(indexFile.toString('utf-8'));

    for (const item of indexData) {
        const csvFile = await readFile(join(DATA_DIR, item.csv), { encoding: 'latin1' });

        console.log('parsing csv file', item.csv);
        const courses = parseCsv(csvFile);

        const department: Omit<Department, 'id'> = {
            department_name: item.title,
            department_slug: item.slug,
            department_description: item.description,
            courses: [],
        };

        const insertedDepartment = await insertDepartment(department);

        if (!insertedDepartment) {
            console.error('department not inserted:', department.department_name);
            continue;
        }

        let validInserts = 0;
        let invalidInserts = 0;

        for (const course of courses) {
            const insertedCourse = await insertCourse(course, insertedDepartment.id);

            if (insertedCourse) {
                validInserts++;
            } else {
                invalidInserts++;
            }
        }
        console.info(`Created ${validInserts} courses for ${insertedDepartment.department_name} and failed to create ${invalidInserts} courses`);
    }
}

setup().then(() => {
    console.log('setup complete');
    poolEnd();
    process.exit(0);
}).catch((e) => {
    console.error('setup failed', e);
    poolEnd();
    process.exit(-1);
});