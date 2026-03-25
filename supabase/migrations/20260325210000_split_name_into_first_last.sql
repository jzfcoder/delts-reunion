-- Split single "name" column into "first_name" and "last_name"
alter table attendees add column first_name text;
alter table attendees add column last_name text;

-- Migrate existing data: first word -> first_name, rest -> last_name
update attendees
set first_name = split_part(name, ' ', 1),
    last_name  = nullif(trim(substring(name from position(' ' in name) + 1)), '');

-- Make first_name required
alter table attendees alter column first_name set not null;

-- Drop the old column
alter table attendees drop column name;
