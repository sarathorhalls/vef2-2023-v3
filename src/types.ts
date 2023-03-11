/**
 * Index file with list of departments.
 * @typedef {object} IndexFile
 * @property {string} title - title of the department
 * @property {string} description - description of the department
 * @property {string} csv - filename of the CSV file
 * @property {string} html - filename of the HTML file
 * @property {Array<Course>} courses - list of courses
 */
export type IndexFile = {
    title: string;
    description: string;
    csv: string;
    html: string;
    courses: Course[];
};

/**
 * Course data.
 * @typedef {object} Course
 * @property {string | undefined} id - ID of the course
 * @property {string} title - title of the course
 * @property {number | undefined} units - course units
 * @property {'Vor' | 'Sumar' | 'Haust' | Heilsárs | undefined} semester - semester the course is offered
 * @property {string | undefined} level - level of the course
 * @property {string | undefined} url - url of the course
 */
export type Course = {
    id?: string;
    course_id?: string;
    course_title: string;
    course_units?: number;
    course_semester?: 'Vor' | 'Sumar' | 'Haust' | 'Heilsárs';
    course_level?: string;
    course_url?: string;
};

/**
 * Department data.
 * @typedef {object} Department
 * @property {string} department_name - name of the department
 * @property {string} department_slug - slug of the department
 * @property {string} department_description - description of the department
 * @property {Array<Course>} courses - list of courses
 */
export type Department = {
    id: number;
    department_name: string;
    department_slug: string;
    department_description: string;
    courses: Course[];
};

/**
 * Department data with CSV filename.
 * @typedef {object} DepartmentImport
 * @property {string} title - title of the department
 * @property {string} slug - slug of the department
 * @property {string} description - description of the department
 * @property {string} csv - filename of the CSV file
 */
export type DepartmentImport = {
    title: string;
    slug: string;
    description: string;
    csv: string;
};