param(
    [ValidateSet("all", "edge", "chrome")]
    [string] $Browsers = "all",
    [switch] $Rebuild,
    [switch] $Open,
    [Alias("NoOpen")]
    [switch] $NoOpenLegacy,
    [switch] $NoCopy
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptRoot
$distRoot = Join-Path $repoRoot "dist"
$urlPath = Join-Path $distRoot "selector-capture-mode.url.txt"
$bookmarkInstallPath = Join-Path $distRoot "selector-capture-mode-bookmark.html"
$bookmarkName = "Selector Capture Mode"

if ($Rebuild -or !(Test-Path $urlPath)) {
  if ($Rebuild) {
    Write-Host "Rebuilding bookmark URL from source..."
  } else {
    Write-Host "Bookmark URL not found, regenerating from source..."
  }
  Push-Location $repoRoot
  try {
    node scripts/build-bookmarklet.mjs
  } finally {
    Pop-Location
  }
}

$bookmarkUrl = (Get-Content -Path $urlPath -Raw).Trim()
if (-not $bookmarkUrl) {
  throw "Could not read bookmark URL from $urlPath"
}

$bookmarkPage = @"
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>$bookmarkName</title>
    <style>
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 20px;
        background: #eef2f7;
        color: #172033;
      }
      .card {
        max-width: 900px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #d8dee9;
        border-radius: 8px;
        padding: 16px;
      }
      a {
        display: inline-block;
        font-weight: 700;
        color: #ffffff;
        background: #1457d9;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 6px;
      }
      button {
        margin: 10px 0;
        min-height: 34px;
        border: 1px solid #b8c2d1;
        border-radius: 6px;
        background: #ffffff;
        font-weight: 700;
        padding: 0 12px;
      }
      textarea {
        width: 100%;
        min-height: 110px;
        margin-top: 8px;
        font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      }
    </style>
  </head>
  <body>
    <section class="card">
      <h1>Selector Capture Mode</h1>
      <p>Drag the blue link below to your Bookmarks Bar.</p>
      <p><a id="bookmark" href="$bookmarkUrl">$bookmarkName</a></p>
      <button id="copy-button" type="button">Copy bookmark URL</button>
      <p>Or paste this URL into a bookmark manually:</p>
      <textarea id="url-output" readonly>$bookmarkUrl</textarea>
    </section>
    <script>
      const url = document.getElementById("url-output").value;
      document.getElementById("copy-button").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(url);
          alert("Copied bookmark URL");
        } catch (error) {
          const ta = document.getElementById("url-output");
          ta.select();
          document.execCommand("copy");
        }
      });
    </script>
  </body>
</html>
"@

Set-Content -Path $bookmarkInstallPath -Value $bookmarkPage -Encoding UTF8
Write-Host "Generated install page: $bookmarkInstallPath"

if (!$NoCopy) {
  try {
    Set-Clipboard -Value $bookmarkUrl
    Write-Host "Copied bookmark URL to clipboard."
  } catch {
    Write-Host "Clipboard copy failed. Use the generated HTML file and copy manually."
  }
}

if (!($Open -and -not $NoOpenLegacy)) {
  Write-Host "Done. Did not launch Edge/Chrome."
  Write-Host "Open manually: file://$bookmarkInstallPath"
  return
}

function Get-BrowserExe {
  param([string] $name)
  $command = Get-Command $name -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

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
    if (Test-Path $p) {
      return $p
    }
  }

  return $null
}

function Open-InBrowser {
  param(
    [string] $label,
    [string] $exe,
    [string[]] $urls
  )

  if (-not $exe) {
    Write-Host "Could not find $label executable."
    return
  }

  foreach ($url in $urls) {
    try {
      Start-Process -FilePath $exe -ArgumentList $url | Out-Null
    } catch {
      Write-Host "Failed to open $label at $url"
    }
  }
}

$bookmarkUri = (New-Object System.Uri((Resolve-Path $bookmarkInstallPath).Path)).AbsoluteUri

if ($Browsers -eq "all" -or $Browsers -eq "edge") {
  $edge = Get-BrowserExe "msedge"
  Open-InBrowser -label "Edge" -exe $edge -urls @($bookmarkUri, "edge://favorites/")
}

if ($Browsers -eq "all" -or $Browsers -eq "chrome") {
  $chrome = Get-BrowserExe "chrome"
  Open-InBrowser -label "Chrome" -urls @($bookmarkUri, "chrome://bookmarks/") -exe $chrome
}

Write-Host ""
Write-Host "Done. In the browser:"
if ($Browsers -eq "edge") {
  Write-Host "- Drag the blue link to the Bookmarks Bar in Edge."
}
if ($Browsers -eq "chrome") {
  Write-Host "- Drag the blue link to the Bookmarks Bar in Chrome."
}
if ($Browsers -eq "all") {
  Write-Host "- Drag the blue link to the Bookmarks Bar in Edge and Chrome."
}
