CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  birth_date date,
  weight numeric(6,2) CHECK (weight > 0 AND weight < 1000),
  height numeric(4,2) CHECK (height > 0 AND height < 3),
  target_weight numeric(6,2) CHECK (target_weight > 0 AND target_weight < 1000),
  profile_photo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  description text CHECK (char_length(description) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workouts_own" ON public.workouts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER workouts_updated_at BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  sets integer NOT NULL DEFAULT 3 CHECK (sets BETWEEN 1 AND 100),
  repetitions integer NOT NULL DEFAULT 10 CHECK (repetitions BETWEEN 1 AND 1000),
  weight numeric(7,2) NOT NULL DEFAULT 0 CHECK (weight >= 0 AND weight < 10000),
  notes text CHECK (char_length(notes) <= 1000),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
GRANT ALL ON public.exercises TO service_role;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_own" ON public.exercises FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()));
CREATE TRIGGER exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workout_id uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT true,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_logs TO authenticated;
GRANT ALL ON public.workout_logs TO service_role;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workout_logs_own" ON public.workout_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.exercises e WHERE e.id = exercise_id AND e.user_id = auth.uid()));
CREATE UNIQUE INDEX workout_logs_daily_unique ON public.workout_logs(user_id, exercise_id, ((completed_at AT TIME ZONE 'UTC')::date));

CREATE TABLE public.diets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diets TO authenticated;
GRANT ALL ON public.diets TO service_role;
ALTER TABLE public.diets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diets_own" ON public.diets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER diets_updated_at BEFORE UPDATE ON public.diets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_id uuid NOT NULL REFERENCES public.diets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  time time,
  notes text CHECK (char_length(notes) <= 1000),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meals TO authenticated;
GRANT ALL ON public.meals TO service_role;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meals_own" ON public.meals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.diets d WHERE d.id = diet_id AND d.user_id = auth.uid()));
CREATE TRIGGER meals_updated_at BEFORE UPDATE ON public.meals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.meal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  food text NOT NULL CHECK (char_length(food) BETWEEN 1 AND 120),
  quantity numeric(8,2) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL CHECK (char_length(unit) BETWEEN 1 AND 40),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meal_items TO authenticated;
GRANT ALL ON public.meal_items TO service_role;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_items_own" ON public.meal_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.meals m WHERE m.id = meal_id AND m.user_id = auth.uid()));
CREATE TRIGGER meal_items_updated_at BEFORE UPDATE ON public.meal_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.meal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  meal_id uuid NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT true,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meal_logs TO authenticated;
GRANT ALL ON public.meal_logs TO service_role;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_logs_own" ON public.meal_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.meals m WHERE m.id = meal_id AND m.user_id = auth.uid()));
CREATE UNIQUE INDEX meal_logs_daily_unique ON public.meal_logs(user_id, meal_id, ((completed_at AT TIME ZONE 'UTC')::date));

CREATE TABLE public.progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL DEFAULT current_date,
  weight numeric(6,2) CHECK (weight > 0 AND weight < 1000),
  muscle_mass numeric(6,2) CHECK (muscle_mass >= 0 AND muscle_mass < 1000),
  exercise_name text CHECK (char_length(exercise_name) <= 120),
  exercise_load numeric(7,2) CHECK (exercise_load >= 0 AND exercise_load < 10000),
  cardio_distance numeric(8,2) CHECK (cardio_distance >= 0),
  cardio_time integer CHECK (cardio_time >= 0),
  notes text CHECK (char_length(notes) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own" ON public.progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX progress_user_date_idx ON public.progress(user_id, date DESC);
CREATE TRIGGER progress_updated_at BEFORE UPDATE ON public.progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  photo_url text NOT NULL,
  storage_path text NOT NULL,
  date date NOT NULL DEFAULT current_date,
  description text CHECK (char_length(description) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress_photos TO authenticated;
GRANT ALL ON public.progress_photos TO service_role;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_photos_own" ON public.progress_photos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX progress_photos_user_date_idx ON public.progress_photos(user_id, date DESC);