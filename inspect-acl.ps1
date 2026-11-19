$f = 'D:\.pnpm-store\v11\files\33\b65ae89a6d9674405de85ef478cc149c69dcca5d52ffcc113ab1d8aeb2fa6768d2298af21f1181451b5cf83c9c3471023443a58aa570fc046264a52f783d2b'
$out = 'D:\Web\Project\project-and-taskmanager\acl_detail.txt'
"=== whoami: $(whoami)" | Out-File $out
try {
  $acl = Get-Acl $f
  "Owner: $($acl.Owner)" | Out-File $out -Append
  $acl.AccessToString | Out-File $out -Append
} catch {
  "Get-Acl failed: $_" | Out-File $out -Append
}
# count denied files in store
$denied = 0; $ok = 0
Get-ChildItem 'D:\.pnpm-store\v11\files' -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
  try { [IO.File]::OpenRead($_.FullName).Close(); $script:ok++ } catch { $script:denied++ }
}
"Readable: $ok  Denied: $denied" | Out-File $out -Append
