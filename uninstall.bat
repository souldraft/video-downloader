@echo off
setlocal
title Video Downloader - uninstall
echo This removes Video Downloader, its settings and its tools folder.
echo Your downloaded videos are NOT touched.
echo.
choice /c YN /m "Uninstall now"
if errorlevel 2 exit /b 0
taskkill /im VideoDownloader.exe /f >nul 2>&1
rmdir /s /q "%LOCALAPPDATA%\Programs\VideoDownloader" 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "foreach ($dir in @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs'))) {" ^
  "  Remove-Item -LiteralPath (Join-Path $dir 'Video Downloader.lnk') -ErrorAction SilentlyContinue }"
echo Done. (yt-dlp and FFmpeg installed with winget stay installed.)
pause
