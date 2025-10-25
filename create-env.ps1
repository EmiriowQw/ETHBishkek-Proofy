# PowerShell script to create .env.local file

$envContent = @"
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ALCHEMY_ID=demo-api-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=demo-project-id
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
"@

Set-Content -Path ".env.local" -Value $envContent

Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 File contents:" -ForegroundColor Yellow
Get-Content ".env.local"
Write-Host ""
Write-Host "🚀 Now you can run: npm run dev" -ForegroundColor Cyan

