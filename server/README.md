# Prestige Server

Our backend in the flesh. Handles communications, messaging where possible, and user updates.

## Local Testing

Must have Golang installed and access to database credentials.

Simplest way to run the app is with the following commands.

```shell
# Since powershell is annoying, we'll have to do the following
# Starting the app. Feel free to run this each time you spin up the app
$env:SUPABASE_URL='https://supaprojecturl.supabase.co'; $env:SUPABASE_KEY='supa_top_secret_server_key'; go run .

# Clearing saved environmental variables
Remove-Item Env:\SUPABASE_URL; Remove-Item Env:\SUPABASE_KEY;

# Linux - peace of mind. Pure bliss. Bash, as it should be.
SUPABASE_URL='https://supaprojecturl.supabase.co' SUPABASE_KEY='supa_top_secret_server_key' go run .
```

A template env file can be found at `env.template`. You can use this to create a `.env.local` file where you actually store your url and key. `.env.local` is ignored by commit so its mostly for local records-keeping.
