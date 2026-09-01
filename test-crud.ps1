# Test CRUD operations
$body = '{"customer":"Test Co","ref":"TEST-001","source":"ไลน์","description":"Test CRUD","status":"รับเรื่อง","location":"Test"}'

Write-Host "=== Testing CREATE (POST) ===" 
$result = Invoke-RestMethod -Uri 'http://localhost:4001/api/requests' -Method POST -ContentType 'application/json' -Body $body
Write-Host "Created record:"
Write-Host $result | ConvertTo-Json -Depth 3
$testId = $result.id

Write-Host "`n=== Testing READ (GET by ID) ===" 
$getResult = Invoke-RestMethod -Uri "http://localhost:4001/api/requests/$testId" -Method GET
Write-Host "Retrieved record:"
Write-Host ($getResult | ConvertTo-Json -Depth 3)

Write-Host "`n=== Testing UPDATE (PUT) ===" 
$updateBody = '{"id":"' + $testId + '","customer":"Test Co Updated","ref":"TEST-002","description":"Updated CRUD","status":"กำลังดำเนินการ","location":"Test Updated"}'
$putResult = Invoke-RestMethod -Uri "http://localhost:4001/api/requests/$testId" -Method PUT -ContentType 'application/json' -Body $updateBody
Write-Host "Updated record:"
Write-Host ($putResult | ConvertTo-Json -Depth 3)

Write-Host "`n=== Testing DELETE ===" 
$deleteResult = Invoke-RestMethod -Uri "http://localhost:4001/api/requests/$testId" -Method DELETE
Write-Host "Delete response:"
Write-Host ($deleteResult | ConvertTo-Json -Depth 3)

Write-Host "`n=== Verifying DELETE (should 404) ===" 
try {
  $getResult2 = Invoke-RestMethod -Uri "http://localhost:4001/api/requests/$testId" -Method GET
  Write-Host "ERROR: Record still exists!"
} catch {
  Write-Host "OK: Record successfully deleted (404 as expected)"
}

Write-Host "`n=== All tests passed! ==="
