create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key,
  email text unique,
  nickname text,
  avatar_url text,
  plan text not null default 'free',
  daily_ai_limit int not null default 20,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  source_url text,
  notes text not null default '',
  import_mode text not null default 'note',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_recipes_user_id on recipes(user_id);
create index if not exists idx_recipes_updated_at on recipes(updated_at desc);

create table if not exists recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  sort_order int not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipe_ingredients_recipe_id on recipe_ingredients(recipe_id);
create index if not exists idx_recipe_ingredients_sort_order on recipe_ingredients(recipe_id, sort_order);

create table if not exists recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  sort_order int not null,
  title text not null default '',
  detail text not null default '',
  duration text not null default '',
  tip text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_recipe_steps_recipe_id on recipe_steps(recipe_id);
create index if not exists idx_recipe_steps_sort_order on recipe_steps(recipe_id, sort_order);

create table if not exists recipe_imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  source_url text not null default '',
  import_mode text not null default 'note',
  raw_text text not null,
  parsed_title text not null default '',
  parsed_result jsonb not null default '{}'::jsonb,
  unresolved jsonb not null default '[]'::jsonb,
  provider text not null default 'openai',
  model text not null default '',
  success boolean not null default false,
  error_message text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_recipe_imports_user_id on recipe_imports(user_id);
create index if not exists idx_recipe_imports_created_at on recipe_imports(created_at desc);

create table if not exists ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  endpoint text not null,
  provider text not null default 'openai',
  model text not null,
  request_chars int not null default 0,
  success boolean not null default false,
  error_code text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_usage_logs_user_id on ai_usage_logs(user_id);
create index if not exists idx_ai_usage_logs_created_at on ai_usage_logs(created_at desc);
