param(
  [int]$Port = $(if ($env:EDGE_CDP_PORT) { [int]$env:EDGE_CDP_PORT } else { 9222 }),
  [string]$ProfileDirectory = $(if ($env:EDGE_CDP_PROFILE_DIRECTORY) { $env:EDGE_CDP_PROFILE_DIRECTORY } else { "Profile 1" }),
  [string]$Url = $(if ($env:EDGE_CDP_URL) { $env:EDGE_CDP_URL } else { "about:blank" }),
  [switch]$RestartIfNeeded,
  [switch]$KillExisting,
  [switch]$InstallShortcuts,
  [switch]$InstallStartup,
  [switch]$Wait,
  [switch]$Status
)

$ErrorActionPreference = "Stop"

function Get-EdgeExe {
  $candidates = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
  )
  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path $candidate)) {
      return $candidate
    }
  }
  throw "Microsoft Edge executable not found"
}

function Get-EdgeCdpArgs([switch]$NoStartupWindow) {
  $items = @(
    "--remote-debugging-port=$Port",
    "--remote-debugging-address=127.0.0.1",
    "--disable-features=msIPv6OnlyLoopback",
    "--profile-directory=`"$ProfileDirectory`"",
    "--no-first-run",
    "--no-default-browser-check"
  )
  if ($NoStartupWindow) {
    $items += "--no-startup-window"
  }
  return $items
}

function Test-EdgeCdp {
  $urls = @(
    "http://127.0.0.1:$Port/json/version",
    "http://[::1]:$Port/json/version"
  )
  foreach ($probe in $urls) {
    try {
      $response = Invoke-RestMethod -Uri $probe -TimeoutSec 2
      if ($response.webSocketDebuggerUrl) {
        return [PSCustomObject]@{
          ok = $true
          url = $probe
          browser = $response.Browser
          webSocketDebuggerUrl = $response.webSocketDebuggerUrl
        }
      }
    } catch {
    }
  }
  return [PSCustomObject]@{ ok = $false }
}

function Stop-Edge {
  Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 700
}

function Start-EdgeCdp([switch]$NoStartupWindow) {
  $edgeExe = Get-EdgeExe
  $args = Get-EdgeCdpArgs -NoStartupWindow:$NoStartupWindow
  if (-not $NoStartupWindow -and $Url) {
    $args += $Url
  }
  Start-Process -FilePath $edgeExe -ArgumentList $args | Out-Null
}

function Wait-EdgeCdp {
  $deadline = (Get-Date).AddSeconds(35)
  do {
    $status = Test-EdgeCdp
    if ($status.ok) {
      return $status
    }
    Start-Sleep -Milliseconds 500
  } while ((Get-Date) -lt $deadline)
  throw "Edge CDP did not become reachable on port $Port"
}

function Set-Shortcut($Path, [switch]$NoStartupWindow) {
  $edgeExe = Get-EdgeExe
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($Path)
  $shortcut.TargetPath = $edgeExe
  $shortcut.WorkingDirectory = Split-Path -Parent $edgeExe
  $shortcut.Arguments = (Get-EdgeCdpArgs -NoStartupWindow:$NoStartupWindow) -join " "
  $shortcut.IconLocation = "$edgeExe,0"
  $shortcut.Save()
}

function Install-EdgeShortcuts {
  $targets = @()
  $targets += Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Microsoft Edge CDP.lnk"
  $targets += Join-Path $env:APPDATA "Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar\Microsoft Edge CDP.lnk"
  $common = Join-Path $env:PROGRAMDATA "Microsoft\Windows\Start Menu\Programs\Microsoft Edge.lnk"
  if (Test-Path $common) {
    try {
      Set-Shortcut -Path $common
      $targets += $common
    } catch {
      $targets += Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Microsoft Edge.lnk"
    }
  }
  foreach ($target in $targets | Select-Object -Unique) {
    Set-Shortcut -Path $target
  }
  return $targets | Select-Object -Unique
}

function Install-EdgeStartup {
  $startup = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup\Microsoft Edge CDP.lnk"
  Set-Shortcut -Path $startup -NoStartupWindow
  return $startup
}

if ($InstallShortcuts) {
  $paths = Install-EdgeShortcuts
  $paths | ForEach-Object { Write-Output "shortcut=$_" }
}

if ($InstallStartup) {
  $path = Install-EdgeStartup
  Write-Output "startup=$path"
}

if ($KillExisting) {
  Stop-Edge
}

$current = Test-EdgeCdp
if (-not $current.ok) {
  if ($RestartIfNeeded) {
    Stop-Edge
  }
  Start-EdgeCdp
}

if ($Wait) {
  $current = Wait-EdgeCdp
}

if ($Status -or $Wait) {
  $current | ConvertTo-Json -Compress
}
