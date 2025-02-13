
create table if not exists tags (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    color text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists ticket_tags (
    ticket_id uuid references tickets(id) on delete cascade,
    tag_id uuid references tags(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (ticket_id, tag_id)
);

-- Add updated_at trigger for tags table
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_tags_updated_at
    before update on tags
    for each row
    execute function update_updated_at_column();
