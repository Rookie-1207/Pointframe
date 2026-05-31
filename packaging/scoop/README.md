# Scoop packaging

[`pointframe.json`](pointframe.json) is the [Scoop](https://scoop.sh) manifest for installing
Pointframe via the command line.

Pointframe ships as an Inno Setup installer, so the manifest uses `"innosetup": true` — Scoop
extracts the self-contained `Pointframe.exe` with `innounp` (auto-installed by Scoop) instead of
running the GUI installer. ffmpeg (needed for MP4 recording and GIF export) is listed under
`suggest`, not `depends`, so it stays optional.

## Test locally before submitting

```powershell
# Install straight from the local manifest
scoop install .\packaging\scoop\pointframe.json

# Confirm it launches, then uninstall
pointframe
scoop uninstall pointframe
```

If Scoop reports it cannot find `Pointframe.exe` after extraction, the `extract_dir` value needs
adjusting — `innounp` lays files out under a folder named for their Inno destination constant
(`{app}`). Try removing `extract_dir`, or set it to `app`, and re-test.

## Publishing to the Scoop Extras bucket

Once the local install is verified, open a PR adding `pointframe.json` to
[ScoopInstaller/Extras](https://github.com/ScoopInstaller/Extras). Users then install with:

```powershell
scoop bucket add extras
scoop install pointframe
```

`checkver` + `autoupdate` are already wired to GitHub Releases, so the Extras auto-PR bot will
bump the version and hash on each new release with no manual edits.

## Updating the hash after a release

The committed `version`/`hash` point at the latest release at authoring time. To refresh manually:

```powershell
$v = "6.3.2"
$url = "https://github.com/dimitar-radenkov/Pointframe/releases/download/v$v/Pointframe-$v-x64-Setup.exe"
(Get-FileHash (Invoke-WebRequest $url -OutFile pf.exe -PassThru).BaseResponse.RequestMessage.RequestUri; "pf.exe") -Algorithm SHA256
```
