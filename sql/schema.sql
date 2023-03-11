CREATE TABLE public.department (
    department_id serial NOT NULL UNIQUE,
    department_name varchar(64) NOT NULL UNIQUE,
    department_slug varchar(64) NOT NULL UNIQUE,
    department_description varchar(1000) NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (department_id)
);

CREATE TYPE semester AS ENUM ('Vor', 'Sumar', 'Haust', 'Heilsárs');

CREATE TABLE public.course (
    id serial NOT NULL UNIQUE,
    course_id varchar(16) NOT NULL,
    department_id integer NOT NULL,
    course_title varchar(64) NOT NULL,
    course_units REAL NOT NULL CONSTRAINT course_units_check CHECK (course_units > 0),
    course_semester semester NOT NULL,
    course_level varchar(128) DEFAULT NULL,
    course_url varchar(256) DEFAULT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(department_id)
);