-- Make the profile-creation trigger non-fatal (won't block user signup)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO profiles (id, email, name, avatar_url, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.raw_user_meta_data ->> 'avatar_url',
      'visitor'
    );
  EXCEPTION WHEN OTHERS THEN
    NULL; -- ignore profile creation errors
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    IF NEW.email IN ('hamedpro.work@gmail.com', 'hamussein01@gmail.com') THEN
      UPDATE profiles SET role = 'admin' WHERE id = NEW.id;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
