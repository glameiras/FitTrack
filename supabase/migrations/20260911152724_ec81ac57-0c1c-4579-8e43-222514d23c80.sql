CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, birth_date, weight, height, target_weight)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'name', ''), split_part(COALESCE(NEW.email, 'Atleta'), '@', 1)),
    COALESCE(NEW.email, ''),
    NULLIF(NEW.raw_user_meta_data ->> 'birth_date', '')::date,
    NULLIF(NEW.raw_user_meta_data ->> 'weight', '')::numeric,
    NULLIF(NEW.raw_user_meta_data ->> 'height', '')::numeric,
    NULLIF(NEW.raw_user_meta_data ->> 'target_weight', '')::numeric
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();