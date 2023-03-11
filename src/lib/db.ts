import pg from 'pg';
import { Course, Department } from '../types';
import * as dotenv from 'dotenv';
import { courseMapper, departmentMapper } from '../lib/mappers.js';

dotenv.config();

const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if(!PGHOST || !PGPORT || !PGDATABASE || !PGUSER || !PGPASSWORD) {
    console.error('Missing environment variables');
    process.exit(1);
}

const pool = new pg.Pool({
    host: PGHOST,
    port: parseInt(PGPORT),
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
});

pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export async function query(schema: string, values:any[] = []) {   
    let client;
    try {
        client = await pool.connect();
    } catch (e) {
        console.error('unable to connect to pool', e);
        return null;
    }
    
    try {
        const result = await client.query(schema, values);
        return result;
    } catch (e) {
        console.error('unable to query', e);
        console.info('schema', schema);
        console.info('values', values);
        return null;
    } finally {
        client.release();
    }
}

export async function insertCourse(course: Omit<Course, 'id'>, department_id: number): Promise<Course | null> {
    const { course_id, course_title, course_units, course_semester, course_level, course_url } = course;
    const result = await query('INSERT INTO course (course_id, department_id, course_title, course_units, course_semester, course_level, course_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [course_id, department_id, course_title, course_units, course_semester, course_level, course_url]);

    try {
        const mapped = courseMapper(result?.rows[0]);
        return mapped;
    } catch (error) {
        //console.error('unable to map course', error);
        return null;
    }
    
}

export async function insertDepartment(department: Omit<Department, 'id'>): Promise<Department | null> {
    const { department_name, department_slug, department_description } = department;
    const result = await query('INSERT INTO department (department_name, department_slug, department_description) VALUES ($1, $2, $3) RETURNING *', [department_name, department_slug, department_description]);

    try {
        const mapped = departmentMapper(result?.rows[0]);
        return mapped;
    } catch (error) {
        //console.error('unable to map department', error);
        return null;
    }
}

export async function poolEnd() {
    await pool.end();
}
