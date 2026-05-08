param(
    [ValidateSet("all", "edge", "chrome")]
    [string] $Browsers = "all",
    [switch] $Open
)

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$extRoot = Join-Path $repoRoot "extension"

if (!(Test-Path (Join-Path $extRoot "manifest.json"))) {
  Write-Host "Extension build artifacts missing. Running build first..."
  npm run build:extension
}

if (!(Test-Path (Join-Path $extRoot "manifest.json"))) {
  throw "Extension build failed: manifest.json not found at $extRoot"
}

Write-Host "Extension ready:"
Write-Host " $extRoot"
Write-Host ""
Write-Host "Edge/Chrome install steps:"
Write-Host " 1) Open edge://extensions or chrome://extensions"
Write-Host " 2) Enable Developer mode"
Write-Host " 3) Click Load unpacked and select:"
Write-Host "    $extRoot"

if (-not $Open) {
  Write-Host ""
  Write-Host "To open extension manager pages now, add -Open."
  return
}

function Get-BrowserExe {
  param([string] $name)

  if ($name -ieq "msedge") {
    $paths = @(
      "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
      "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    )
  } else {
    $paths = @(
      "C:\Program Files\Google\Chrome\Application\chrome.exe",
      "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    )
  }

  foreach ($p in $paths) {
    if (Test-Path $p) { return $p }
  }

  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

function Open-Manager {
  param([string] $label, [string] $exe)
  if (-not $exe) {
    Write-Host "Could not find $label executable. Open it manually and load unpacked from $extRoot"
    return
  }

  $uri = if ($label -eq "Edge") { "edge://extensions" } else { "chrome://extensions" }
  Start-Process -FilePath $exe -ArgumentList $uri | Out-Null
}

if ($Browsers -eq "all" -or $Browsers -eq "edge") {
  Open-Manager -label "Edge" -exe (Get-BrowserExe "msedge")
}

if ($Browsers -eq "all" -or $Browsers -eq "chrome") {
  Open-Manager -label "Chrome" -exe (Get-BrowserExe "chrome")
}

Write-Host ""
Write-Host "If only one browser opened, pin it and open extensions and click Load unpacked."
