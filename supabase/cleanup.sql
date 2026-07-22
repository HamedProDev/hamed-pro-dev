-- Drop everything in correct order (respects foreign keys)
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

DROP FUNCTION IF EXISTS set_admin_role();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at();

DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS site_stats CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
