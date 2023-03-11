import { Course, Department } from "../types";

export function departmentMapper(row: any): Department | null {
    if (!row) {
        throw new Error("department undefined");
    }
    return {
        id: row.department_id,
        department_name: row.department_name,
        department_slug: row.department_slug,
        department_description: row.department_description,
        courses: []
    };
}

export function courseMapper(row: any): Course {
    if(!row) {
        throw new Error('course undefined');
    }
    return {
        id: row.id,
        course_id: row.course_id,
        course_title: row.title,
        course_units: row.units,
        course_semester: row.semester,
        course_level: row.level,
        course_url: row.url
    };
}

export function valueToSemester(value: string | undefined): Course["course_semester"] {
    const semester = value?.trim().toLowerCase();
    switch (semester) {
        case "vor" : return "Vor";
        case "sumar" : return "Sumar";
        case "haust" : return "Haust";
        case "heilsárs" : return "Heilsárs";
        default: return undefined;
    }
}