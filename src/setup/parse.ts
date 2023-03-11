import slugify from "slugify";
import { valueToSemester } from "../lib/mappers.js";
import { DepartmentImport, Course } from "../types";

export function parseJson(input: string): Array<DepartmentImport> {
    let parsed: unknown;
    try {
        parsed = JSON.parse(input);
    } catch (e) {
        console.error("error parsing JSON", e);
        return [];
    }
    
    if (!Array.isArray(parsed)) {
        return [];
    }
    
    const items: Array<DepartmentImport> = [];
    for (const i of parsed) {
        const item = i as Partial<DepartmentImport>;
        if (!item.title || !item.description || !item.csv) {
            console.warn("missing required properties in JSON");
        } else {
            items.push({
                title: item.title,
                slug: slugify(item.title).toLowerCase(),
                description: item.description,
                csv: item.csv,
            });
        }
    }
    
    return items;
}

function parseLine(line: string): Omit<Course, "id"> | null {
    if (line[0] === ";") {
        line = line.slice(1);
    }
    const [
        id = undefined,
        title = undefined,
        lineUnits = undefined,
        lineSemester = undefined,
        lineLevel = undefined,
        lineUrl = undefined,
    ] = line.split(";");

    const formattedUnits = (lineUnits ?? "").replace(/\./g, "").replace(",", ".");
    const parsedUnits = Number.parseFloat(formattedUnits);
    const units =
        (lineUnits ?? "").indexOf(".") < 0 &&
        !Number.isNaN(parsedUnits) &&
        formattedUnits === parsedUnits.toString()
        ? parsedUnits
        : undefined;

    const semester = valueToSemester(lineSemester);

    const level = typeof lineLevel === "string" && lineLevel.length ? lineLevel : undefined;

    let url: string | undefined;

    try {
        url = new URL(lineUrl ?? "").href;
    } catch (e) {
        //console.error("error parsing URL", e);
        url = undefined;
    }

    if (!title) {
        return null;
    }

    return {
        course_id: id,
        course_title: title,
        course_units: units,
        course_semester: semester,
        course_level: level,
        course_url: url,
    };
}

export function parseCsv(data: string) {
    if (!data) {
      return [];
    }
  
    const courses = [];
    const lines = data.split('\n').slice(1);
  
    for (const line of lines) {
      const parsed = parseLine(line);
  
      if (parsed) {
        courses.push(parsed);
      } else {
        // console.warn(`error parsing line`, { line });
      }
    }
  
    return courses;
  }