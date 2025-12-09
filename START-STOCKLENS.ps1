# StockLens Quick Start Script
# Double-click this file or run in PowerShell to start the app

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting StockLens Application" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "[1/2] Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

Start-Sleep -Seconds 2

Write-Host "[2/2] Opening Browser in 15 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  StockLens is Starting!" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
