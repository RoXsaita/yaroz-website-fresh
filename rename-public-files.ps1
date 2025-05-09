# PowerShell script to rename image files with a suffix - public version
Write-Host "Starting image file renaming in public directory..." -ForegroundColor Cyan

$fileSuffix = "_file"

# Function to rename files in a directory
function Rename-ImageFiles {
    param (
        [string]$directory
    )
    
    Write-Host "Processing directory: $directory" -ForegroundColor Cyan
    
    # Get all image files recursively
    $imageFiles = Get-ChildItem -Path $directory -Recurse -Include "*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp", "*.svg", "*.mp4"
    
    $count = 0
    
    foreach ($file in $imageFiles) {
        $extension = $file.Extension
        $nameWithoutExt = $file.BaseName
        $newFileName = "$nameWithoutExt$fileSuffix$extension"
        $oldPath = $file.FullName
        $newPath = Join-Path -Path $file.DirectoryName -ChildPath $newFileName
        
        Write-Host "  Renaming: $($file.Name) -> $newFileName" -ForegroundColor Yellow
        
        try {
            Rename-Item -Path $oldPath -NewName $newFileName -Force
            $count++
        }
        catch {
            Write-Host "    ERROR renaming file: $($file.FullName)" -ForegroundColor Red
        }
    }
    
    Write-Host "Renamed $count files in $directory" -ForegroundColor Green
}

# Rename files in public/images
Rename-ImageFiles -directory "public/images"

Write-Host "File renaming in public directory complete." -ForegroundColor Cyan
Write-Host "Don't forget to commit these changes: 'git add .' and 'git commit -m \"Renamed image files for GitHub\"'" 