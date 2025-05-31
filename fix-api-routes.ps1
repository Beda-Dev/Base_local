$apiRoutes = Get-ChildItem -Path "src/app/api" -Recurse -Filter "route.ts"

foreach ($route in $apiRoutes) {
    $content = Get-Content $route.FullName -Raw
    
    # Remove unused NextResponse import if it exists
    $content = $content -replace "import \{ NextResponse \} from 'next/server';\r?\n", ""
    
    # Replace NextResponse with Response in OPTIONS handler if needed
    $content = $content -replace "NextResponse\(null", "Response(null"
    
    # Save the modified content
    Set-Content -Path $route.FullName -Value $content
}

Write-Host "API routes have been fixed!"
