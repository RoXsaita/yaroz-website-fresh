# PowerShell script to rename image files with a suffix
Write-Host "Starting image file renaming..." -ForegroundColor Cyan

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

# Rename files in docs/images
Rename-ImageFiles -directory "docs/images"

Write-Host "File renaming complete." -ForegroundColor Cyan
Write-Host "Now updating HTML references..."

# Function to update HTML references
function Update-HtmlReferences {
    param (
        [string]$directory
    )
    
    $htmlFiles = Get-ChildItem -Path $directory -Filter "*.html" -Recurse
    
    foreach ($file in $htmlFiles) {
        Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
        
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        
        # Regular expression to find image references
        $regex = '(src|href)="([^"]*\.(jpg|jpeg|png|gif|webp|svg|mp4))(")'
        
        $content = $content -replace $regex, {
            $prefix = $_.Groups[1].Value
            $path = $_.Groups[2].Value
            $ext = $_.Groups[3].Value
            $suffix = $_.Groups[4].Value
            
            # Extract filename from path
            $fileName = Split-Path -Path $path -Leaf
            $fileNameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
            $newFileName = "$fileNameWithoutExt$fileSuffix.$ext"
            
            # Replace only the filename part in the path
            $newPath = $path -replace [regex]::Escape($fileName), $newFileName
            
            return "$prefix=""$newPath$suffix"
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content
            Write-Host "  Updated references in $($file.Name)" -ForegroundColor Green
        }
        else {
            Write-Host "  No changes needed in $($file.Name)" -ForegroundColor DarkGray
        }
    }
}

# Update HTML references in docs
Update-HtmlReferences -directory "docs"

Write-Host "HTML references updated successfully."
Write-Host "Don't forget to commit these changes: 'git add .' and 'git commit -m \"Renamed image files for GitHub\"'" 