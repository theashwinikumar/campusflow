-- ==============================================
-- CampusFlow Database Schema
-- ==============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null unique,
  name text not null,
  role text not null check (role in ('student', 'faculty', 'admin', 'warden')),
  department text,
  year text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for users
alter table public.users enable row level security;
create policy "Users can view everyone" on public.users for select using (true);
create policy "Users can insert their own record" on public.users for insert with check (auth.uid() = id);
create policy "Users can update their own record" on public.users for update using (auth.uid() = id);

-- 2. ATTENDANCE Table
create table public.attendance (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.users(id) not null,
  faculty_id uuid references public.users(id) not null,
  subject text not null,
  date date not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.attendance enable row level security;
create policy "Anyone can view attendance" on public.attendance for select using (true);
create policy "Faculty can insert attendance" on public.attendance for insert with check (
  exists (select 1 from public.users where id = auth.uid() and role = 'faculty')
);

-- 3. DOCUMENTS Table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.users(id) not null,
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  remarks text,
  file_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;
create policy "Users can view their own documents" on public.documents for select using (auth.uid() = student_id or exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'faculty')));
create policy "Students can upload documents" on public.documents for insert with check (auth.uid() = student_id);

-- 4. LEAVE REQUESTS Table
create table public.leave_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  approver_id uuid references public.users(id),
  type text not null check (type in ('casual', 'medical', 'academic')),
  start_date date not null,
  end_date date not null,
  reason text not null,
  attachment_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.leave_requests enable row level security;
create policy "Users view own leave rules or approvers view requests" on public.leave_requests for select using (auth.uid() = user_id or auth.uid() = approver_id or exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'warden', 'faculty')));
create policy "Users create own leave" on public.leave_requests for insert with check (auth.uid() = user_id);
create policy "Approvers update leaves" on public.leave_requests for update using (auth.uid() = approver_id or exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'warden', 'faculty')));

-- 5. HOSTEL ROOMS & COMPLAINTS
create table public.hostel_rooms (
  id uuid default uuid_generate_v4() primary key,
  room_no text not null,
  block text not null,
  floor integer not null,
  capacity integer not null default 2,
  occupants uuid[] default array[]::uuid[]
);

create table public.hostel_complaints (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.users(id) not null,
  room_id uuid references public.hostel_rooms(id),
  category text not null,
  description text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hostel_rooms enable row level security;
create policy "Anyone view rooms" on public.hostel_rooms for select using (true);
alter table public.hostel_complaints enable row level security;
create policy "View complaints" on public.hostel_complaints for select using (auth.uid() = student_id or exists (select 1 from public.users where id = auth.uid() and role in ('warden', 'admin')));
create policy "Create complaints" on public.hostel_complaints for insert with check (auth.uid() = student_id);

-- 6. EVENTS & CLUBS
create table public.clubs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  lead_id uuid references public.users(id),
  logo_url text,
  established date
);

create table public.club_members (
  id uuid default uuid_generate_v4() primary key,
  club_id uuid references public.clubs(id) not null,
  user_id uuid references public.users(id) not null,
  role text not null default 'member' check (role in ('member', 'lead', 'core_team')),
  unique(club_id, user_id)
);

create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  time time not null,
  venue text not null,
  category text not null,
  created_by uuid references public.users(id),
  club_id uuid references public.clubs(id),
  rsvp_count integer default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.event_rsvps (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) not null,
  user_id uuid references public.users(id) not null,
  unique(event_id, user_id)
);

alter table public.clubs enable row level security;
create policy "Read clubs" on public.clubs for select using (true);
alter table public.events enable row level security;
create policy "Read events" on public.events for select using (true);
alter table public.event_rsvps enable row level security;
create policy "Read RSVPs" on public.event_rsvps for select using (true);
create policy "Create RSVP" on public.event_rsvps for insert with check (auth.uid() = user_id);
create policy "Delete RSVP" on public.event_rsvps for delete using (auth.uid() = user_id);

-- 7. MESSAGING / MAIL
create table public.mail (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) not null,
  recipient_id uuid references public.users(id) not null,
  subject text not null,
  body text not null,
  is_read boolean default false,
  starred boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.mail enable row level security;
create policy "Users can read own mail" on public.mail for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send mail" on public.mail for insert with check (auth.uid() = sender_id);
create policy "Users can update own mail" on public.mail for update using (auth.uid() = recipient_id or auth.uid() = sender_id);

-- 8. FEE MANAGEMENT
create table public.fees (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.users(id) not null,
  type text not null,
  amount numeric not null,
  due_date date not null,
  paid boolean default false,
  receipt_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.fees enable row level security;
create policy "Users view own fees" on public.fees for select using (auth.uid() = student_id or exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 9. LIBRARY
create table public.library_books (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  author text not null,
  isbn text unique,
  available_copies integer not null default 0
);

create table public.library_issues (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.library_books(id) not null,
  student_id uuid references public.users(id) not null,
  issue_date date not null default current_date,
  due_date date not null,
  return_date date,
  fine numeric default 0
);

alter table public.library_books enable row level security;
create policy "Anyone read books" on public.library_books for select using (true);
alter table public.library_issues enable row level security;
create policy "Read own issues" on public.library_issues for select using (auth.uid() = student_id or exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 10. NOTICES
create table public.notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  body text not null,
  category text not null,
  is_urgent boolean default false,
  pinned boolean default false,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notices enable row level security;
create policy "Anyone read notices" on public.notices for select using (true);
create policy "Admins create notices" on public.notices for insert with check (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'faculty')));

-- 11. EXAMS & RESULTS
create table public.exams (
  id uuid default uuid_generate_v4() primary key,
  subject text not null,
  code text not null,
  date date not null,
  time time not null,
  venue text not null,
  type text not null,
  department text not null,
  year text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.exam_results (
  id uuid default uuid_generate_v4() primary key,
  exam_id uuid references public.exams(id) not null,
  student_id uuid references public.users(id) not null,
  marks numeric not null,
  total numeric not null,
  grade text not null,
  credits integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(exam_id, student_id)
);

alter table public.exams enable row level security;
create policy "Anyone read exams" on public.exams for select using (true);
alter table public.exam_results enable row level security;
create policy "Read own results" on public.exam_results for select using (auth.uid() = student_id or exists (select 1 from public.users where id = auth.uid() and role = 'faculty'));

-- 12. GRIEVANCES
create table public.grievances (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.users(id), -- Nullable if anonymous
  subject text not null,
  description text not null,
  category text not null,
  is_anonymous boolean default false,
  status text not null default 'open' check (status in ('open', 'in-progress', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.grievances enable row level security;
create policy "Read own grievances" on public.grievances for select using (auth.uid() = student_id or exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "Insert grievance" on public.grievances for insert with check (auth.uid() = student_id or is_anonymous = true);

-- 13. TIMETABLE
create table public.timetable (
  id uuid default uuid_generate_v4() primary key,
  department text not null,
  year text not null,
  section text not null,
  day_of_week text not null,
  slot_index integer not null,
  subject_details text not null,
  unique(department, year, section, day_of_week, slot_index)
);

alter table public.timetable enable row level security;
create policy "Anyone read timetable" on public.timetable for select using (true);

-- SET UP STORAGE BUCKETS
-- (You need to create these manually in the Supabase Dashboard -> Storage)
-- Buckets needed: 'documents', 'avatars', 'receipts'
