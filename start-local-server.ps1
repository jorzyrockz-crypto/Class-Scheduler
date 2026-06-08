$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if (-not (Test-Path $python)) {
    $python = "python"
}

Set-Location $root
& $python -m http.server 8000 --bind 127.0.0.1
