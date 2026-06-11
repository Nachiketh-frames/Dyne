do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'wallets_user_id_key'
  ) then
    alter table public.wallets
    add constraint wallets_user_id_key unique (user_id);
  end if;
end $$;

create policy "Users can create own wallet"
on public.wallets
for insert
to authenticated
with check (user_id = auth.uid());
